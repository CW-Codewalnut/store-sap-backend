import { Request, Response, NextFunction } from 'express';
import md5 from 'md5';
import passport from 'passport';

import sequelize from 'sequelize';
import User from '../models/user';
import Role from '../models/role';

import { format, CODE, STATUS } from '../config/response';
// import { saveSessionActivity } from '../middleware/auth';

const { Op } = sequelize;

const auth = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const response = format(
          CODE[400],
          STATUS.FAILURE,
          'Invalid credentials',
          null,
        );
        return res.send(response);
      }
      return req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        // req.session.userId = user.id;
        // const { _expires } = req.session.cookie;
        // req.body.isExpired = _expires;
        /* return saveSessionActivity(
          { req, userId: user.id },
          (errSession: any) => {
            if (errSession) {
              const response = format(
                CODE[500],
                STATUS.FAILURE,
                errSession,
                null,
              );
              return res.send(response);
            }

            const response = format(
              CODE[200],
              STATUS.SUCCESS,
              'Login successfully',
              null,
            );
            return res.send(response);
          },
        ); */
        const response = format(
          CODE[200],
          STATUS.SUCCESS,
          'Login successfully',
          null,
        );
        return res.send(response);
      });
    } catch (error) {
      const response = format(
        CODE[500],
        STATUS.FAILURE,
        JSON.stringify(error),
        null,
      );
      return res.send(response);
    }
  })(req, res, next);
};

const logout = async (req: Request, res: Response) => {
  try {
    req.session.destroy((err: any) => console.log);
    const response = format(CODE[200], STATUS.SUCCESS, 'Logout securely', null);
    return res.send(response);
  } catch (err) {
    const response = format(
      CODE[400],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.send(response);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    if (
      !req.body
      || !req.body.name
      || !req.body.email
      || !req.body.password
      || !req.body.roleId
    ) {
      const response = format(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password.trim());
    }
    // req.body.createdBy = req.user.id;
    // req.body.updatedBy = req.user.id;
    const user = await User.create(req.body);
    const userData = await User.findOne({
      include: [
        {
          model: Role,
        },
      ],
      where: { id: user.id },
    });
    const response = format(CODE[201], STATUS.SUCCESS, 'Created', userData);
    return res.status(201).send(response);
  } catch (err) {
    console.log(err);
    const response = format(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.send(response);
  }
};

const findWithPaginate = async (req: Request, res: Response) => {
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

    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', users);
    res.status(200).send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

const findById = async (req: Request, res: Response) => {
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
      const response = format(
        CODE[404],
        STATUS.SUCCESS,
        'Data not found',
        user,
      );
      return res.status(200).send(response);
    }
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', user);
    return res.status(200).send(response);
  } catch (err) {
    const response = format(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.send(response);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if (
      !req.body
      || !req.body.name
      || !req.body.email
      || !req.body.password
      || !req.body.roleId
    ) {
      const response = format(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password.trim());
    }
    req.body.password = md5(req.body.password.trim());
    // req.body.updatedBy = req.user!.id;
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
    const response = format(CODE[200], STATUS.SUCCESS, 'Updated', userData);
    return res.send(response);
  } catch (err) {
    const response = format(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.send(response);
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
