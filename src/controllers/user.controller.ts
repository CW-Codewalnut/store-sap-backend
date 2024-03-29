import { Request, Response, NextFunction } from 'express';
import md5 from 'md5';
import passport from 'passport';

import sequelize, { Op } from 'sequelize';
import groupBy from 'lodash.groupby';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import User from '../models/user';
import Role from '../models/role';

import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { saveSessionActivity } from '../middleware/auth';
import UserPlant from '../models/user-plant';
import UserPlantModel from '../interfaces/masters/userPlant.interface';
import RolePermission from '../models/role-permission';
import Permission from '../models/permission';
import SessionActivity from '../models/session-activity';
import MESSAGE from '../config/message.json';
import Employee from '../models/employee';
import Plant from '../models/plant';
import PasswordValidateToken from '../models/password-validate-token';
import { DecodedTokenData } from '../interfaces/masters/user.interface';
import Session from '../models/session';

const configs = require('../config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

const getPlantsByUserId = async (
  next: NextFunction,
  userId: string,
): Promise<UserPlantModel[] | undefined> => {
  try {
    const userPlants = await UserPlant.findAll({
      attributes: ['plantId'],
      where: { userId },
      raw: true,
    });
    return userPlants;
  } catch (err) {
    next(err);
  }
};

const getUserPermissions = async (req: Request, next: NextFunction) => {
  try {
    const ids = await RolePermission.findAll({
      where: { roleId: req.user.roleId },
      attributes: ['permissionId'],
      raw: true,
    });

    const permissionIds = ids.map((id) => id.permissionId);
    const permissions = await Permission.findAll({
      where: { id: { [Op.in]: permissionIds } },
    });
    const groupedPermission = groupBy(permissions, 'groupName');

    const userData = await User.findOne({
      include: [
        {
          model: Role,
          attributes: ['name'],
        },
        {
          model: Employee,
          attributes: [],
        },
      ],
      attributes: [
        [sequelize.col('employee.employeeName'), 'name'],
        'employeeCode',
      ],
      where: { id: req.user.id },
    });

    return {
      userData,
      permissions: groupedPermission,
    };
  } catch (err) {
    next(err);
  }
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.INVALID_CREDENTIAL,
          null,
        );
        return res.status(CODE[400]).send(response);
      }
      return req.logIn(user, async (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        req.session.userId = user.id;
        req.body.isExpired = req.session.cookie.expires;
        const userId: string = user.id;
        const sessionId = req.session.id;

        // Set plantId in session if user have one plant access.
        const userPlants = await getPlantsByUserId(next, user.id);
        if (userPlants?.length === 1) {
          req.session.activePlantId = userPlants[0]?.plantId;
        }

        if (userPlants && userPlants.length === 0) {
          const response = responseFormatter(
            CODE[400],
            SUCCESS.FALSE,
            MESSAGE.USER_ACCESS_PREVENT,
            null,
          );
          return res.status(CODE[400]).send(response);
        }
        return saveSessionActivity({
          req,
          userId,
          sessionId,
          callBackFn: async (errSession: any) => {
            if (errSession) {
              const response = responseFormatter(
                CODE[500],
                SUCCESS.FALSE,
                errSession,
                null,
              );
              return res.status(CODE[500]).send(response);
            }

            const userData = await getUserPermissions(req, next);

            const response = responseFormatter(
              CODE[200],
              SUCCESS.TRUE,
              MESSAGE.LOGGED_IN,
              userData,
            );
            return res.status(CODE[200]).send(response);
          },
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.session.id;
    await SessionActivity.update(
      { logoutTime: new Date() },
      { where: { sessionId } },
    );

    req.session.destroy((err: any) => {
      if (err) {
        console.error('Throwing error while destroying session=> ', err);
      }
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.LOGGED_OUT,
      null,
    );
    res.status(CODE[200]).clearCookie('connect.sid').send(response);
  } catch (err) {
    next(err);
  }
};

const sendEmail = async (
  passwordValidateTokenId: string,
  employeeCode: string,
  passwordState: string,
) => {
  try {
    const transporter = await nodeMailer.createTransport({
      host: config.mailHost,
      port: 587,
      secure: false,
      auth: {
        user: config.mailUser,
        pass: config.mailPass,
      },
      tls: { rejectUnauthorized: false },
    });

    const employeeData = await Employee.findOne({ where: { employeeCode } });

    const mailOptions = {
      from: `Store SAP App <${config.mailFrom}>`,
      to: 'umesh@codewalnut.com',
      cc: [
        'umesh@codewalnut.com',
        'lovepreet@codewalnut.com',
        'dhwani@codewalnut.com',
      ],
      subject: `Set your password for ${employeeCode}`,
      html: `<html>
      <body><h4>Dear ${employeeData?.employeeName},</h4><br>
      <p>Click below to ${passwordState} your Store SAP App password</p>
      <p><a href="${config.appBaseUrl}/reset-password/${passwordValidateTokenId}">${config.appBaseUrl}/reset-password/${passwordValidateTokenId}</a></p><br><br>
      <p>At your service,<br>Team Buildpro<br>
      </body></html>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const sendPasswordLink = async (
  userId: string,
  employeeCode: string,
  passwordState: string,
) => {
  try {
    const expiresIn = '2d';
    const token = jwt.sign({ userId }, config.jwtSecret, {
      expiresIn,
    });

    const resetData: any = {
      userId,
      token,
    };

    const passwordTokenData = await PasswordValidateToken.create(resetData);
    return sendEmail(passwordTokenData.id, employeeCode, passwordState);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// eslint-disable-next-line complexity
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.body ||
      !req.body.email ||
      !req.body.employeeCode ||
      req.body.password ||
      !req.body.roleId ||
      !req.body.plantIds ||
      !Array.isArray(req.body.plantIds) ||
      !req.body.plantIds.length
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const { employeeCode, plantIds } = req.body;

    const existingEmployeeCode = await User.findOne({
      where: { employeeCode },
    });

    if (existingEmployeeCode) {
      const response = responseFormatter(
        CODE[422],
        SUCCESS.FALSE,
        MESSAGE.EMPLOYEE_CODE_UNIQUE,
        null,
      );
      return res.status(CODE[422]).send(response);
    }

    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
    const user = await User.create(req.body);

    await sendPasswordLink(user.id, user.employeeCode, 'set');

    const userPlantBody = plantIds.map((plantId: string) => ({
      id: nanoid(16),
      userId: user.id,
      plantId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await UserPlant.bulkCreate(userPlantBody);

    const userData = await User.findOne({
      include: [
        {
          model: Role,
        },
        {
          model: Plant,
          through: { attributes: [] },
        },
      ],
      where: { id: user.id },
    });
    const response = responseFormatter(
      CODE[201],
      SUCCESS.TRUE,
      MESSAGE.USER_CREATED,
      userData,
    );
    return res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

const findWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const { search } = req.query;
    const offset = page * pageSize - pageSize;
    const limit = pageSize;
    let condition = {};

    if (Number.isNaN(page) || Number.isNaN(pageSize) || search === undefined) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    if (search) {
      condition = {
        [Op.or]: [
          { employeeCode: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const users = await User.findAndCountAll({
      attributes: ['id', 'employeeCode', 'email', 'accountStatus', 'createdAt'],
      distinct: true,
      include: [
        {
          model: Role,
        },
        {
          model: Employee,
          attributes: [['employeeName', 'name']],
        },
        {
          model: Plant,
          through: { attributes: [] },
        },
      ],
      where: condition,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      users,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      include: [
        {
          model: Role,
        },
        {
          model: Plant,
          through: { attributes: [] },
        },
      ],
      where: { id },
    });
    if (!user) {
      const response = responseFormatter(
        CODE[404],
        SUCCESS.TRUE,
        MESSAGE.DATA_NOT_FOUND,
        user,
      );
      return res.status(200).send(response);
    }
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      user,
    );
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.body ||
      req.body.password ||
      !req.body.email ||
      !req.body.roleId ||
      !Array.isArray(req.body.plantIds) ||
      !req.body.plantIds.length
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    req.body.updatedBy = req.user.id;

    const { plantIds, ...restUserBody } = req.body;

    await User.update(restUserBody, {
      where: {
        id: req.params.id,
      },
    });

    await UserPlant.destroy({ where: { userId: req.params.id } });

    const userPlantBody = plantIds.map((plantId: string) => ({
      id: nanoid(16),
      userId: req.params.id,
      plantId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await UserPlant.bulkCreate(userPlantBody);

    const userData = await User.findOne({
      include: [
        {
          model: Role,
        },
        {
          model: Plant,
          through: { attributes: [] },
        },
      ],
      where: { id: req.params.id },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.USER_UPDATED,
      userData,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const changeAccountStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const userData = await User.findOne({ where: { id: userId } });

    if (userData && !userData.password && !userData.accountStatus) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.USER_ACTIVATION_NOT_ALLOWED,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const userUpdateData: any = {
      accountStatus: !userData?.accountStatus,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    };

    await User.update(userUpdateData, {
      where: { id: userId },
    });

    // Destroy all session of the user
    await Session.destroy({ where: { userId } });

    const updatedUserData = await User.findOne({
      include: [
        {
          model: Role,
        },
        {
          model: Plant,
          through: { attributes: [] },
        },
      ],
      where: { id: userId },
    });

    const message = userData?.accountStatus
      ? MESSAGE.USER_ACCOUNT_INACTIVE
      : MESSAGE.USER_ACCOUNT_ACTIVE;

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      message,
      updatedUserData,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

/* Reset Password */
const setUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    const { passwordValidateTokenId } = req.body;

    if (!req.body || !password || !passwordValidateTokenId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const passwordValidateData = await PasswordValidateToken.findOne({
      where: { id: passwordValidateTokenId },
    });

    if (!passwordValidateData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const tokenData = (await jwt.verify(
      passwordValidateData.token,
      config.jwtSecret,
    )) as DecodedTokenData;

    if (passwordValidateData.isUsed) {
      const response = responseFormatter(
        CODE[500],
        SUCCESS.FALSE,
        MESSAGE.PASSWORD_USED_LINK,
        null,
      );
      return res.status(CODE[500]).send(response);
    }

    const updatedUser = await User.update(
      {
        password: md5(password.trim()),
        accountStatus: true,
        updatedAt: new Date(),
      },
      { where: { id: tokenData.userId } },
    );

    if (updatedUser[0] === 1) {
      await PasswordValidateToken.update(
        { isUsed: true },
        { where: { id: passwordValidateTokenId } },
      );

      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.PASSWORD_SETTING_SUCCESS,
        null,
      );
      return res.status(CODE[200]).send(response);
    }
    const response = responseFormatter(
      CODE[500],
      SUCCESS.FALSE,
      MESSAGE.PASSWORD_SETTING_ERROR,
      null,
    );
    return res.status(CODE[500]).send(response);
  } catch (err) {
    next(err);
  }
};

const verifyAndSendPasswordResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { employeeCode } = req.body;

    if (!req.body || !employeeCode) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const user = await User.findOne({
      where: { employeeCode },
    });

    if (!user) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.EMPLOYEE_CODE_NOT_FOUND,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    if (user && !user.accountStatus) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.USER_ACCOUNT_INACTIVE_FORGET_PASSWORD,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    await sendPasswordLink(user.id, user.employeeCode, 'reset');

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.PASSWORD_RESET_LINK,
      null,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const setUserPasswordLinkReGenerate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      const response = responseFormatter(
        CODE[404],
        SUCCESS.FALSE,
        MESSAGE.USER_NOT_FOUND,
        null,
      );
      return res.status(CODE[404]).send(response);
    }

    await sendPasswordLink(user.id, user.employeeCode, 'set');

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.PASSWORD_SET_LINK,
      null,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default {
  auth,
  create,
  findWithPaginate,
  logout,
  findById,
  update,
  changeAccountStatus,
  setUserPassword,
  verifyAndSendPasswordResetLink,
  setUserPasswordLinkReGenerate,
};
