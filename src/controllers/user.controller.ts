import { Request, Response, NextFunction } from 'express';
import md5 from 'md5';
import passport from 'passport';

import { Op } from 'sequelize';
import groupBy from 'lodash.groupby';
import { nanoid } from 'nanoid';
import User from '../models/user';
import Role from '../models/role';

import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { saveSessionActivity } from '../middleware/auth';
import UserPlant from '../models/user-plant';
import UserPlantModel from '../interfaces/masters/userPlant.interface';
import RolePermission from '../models/role-permission';
import Permission from '../models/permission';
import SessionActivity from '../models/session-activity';

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
          'Invalid credentials',
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
            "User doesn't have plant access",
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
              'Logged in successfully',
              userData,
            );
            return res.status(CODE[200]).send(response);
          },
        });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
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
      ],
      attributes: ['name', 'email'],
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
      'Logout securely',
      null,
    );
    res.status(CODE[200]).clearCookie('connect.sid').send(response);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.body
      || !req.body.name
      || !req.body.email
      || !req.body.password
      || !req.body.roleId
      || !req.body.plantIds
      || !Array.isArray(req.body.plantIds)
      || !req.body.plantIds.length
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        'Content can not be empty!',
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const { email, plantIds, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const response = responseFormatter(
        CODE[422],
        SUCCESS.FALSE,
        'Email already in use',
        null,
      );
      return res.status(CODE[422]).send(response);
    }

    if (password) {
      req.body.password = md5(password.trim());
    }
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
    const user = await User.create(req.body);

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
      ],
      where: { id: user.id },
    });
    const response = responseFormatter(
      CODE[201],
      SUCCESS.TRUE,
      'User created successfully',
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

    if (search) {
      condition = {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          mobile: { [Op.like]: `%${search}%` },
          email: { [Op.like]: `%${search}%` },
        },
      };
    }

    const users = await User.findAndCountAll({
      include: [
        {
          model: Role,
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
      'Fetched',
      users,
    );
    res.status(200).send(response);
  } catch (err: any) {
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
      ],
      where: { id },
    });
    if (!user) {
      const response = responseFormatter(
        CODE[404],
        SUCCESS.TRUE,
        'Data not found',
        user,
      );
      return res.status(200).send(response);
    }
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
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
      !req.body
      || !req.body.name
      || !req.body.email
      || !req.body.password
      || !req.body.roleId
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        'Content can not be empty!',
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password.trim());
    }
    req.body.password = md5(req.body.password.trim());
    req.body.updatedBy = req.user.id;
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const userData = await User.findOne({
      include: [
        {
          model: Role,
        },
      ],
      where: { id: req.params.id },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Updated',
      userData,
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
};
