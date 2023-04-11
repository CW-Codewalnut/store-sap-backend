import { NextFunction, Request, Response } from 'express';
import groupBy from 'lodash.groupby';
import { Op } from 'sequelize';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/role-permission';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import User from '../models/user';
import MESSAGE from '../config/message.json';
import RolePermissionModel from '../interfaces/masters/rolePermission.interface';
import Employee from '../models/employee';
import sequelize from 'sequelize';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.EMPTY_CONTENT,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const roleIsExist = await Role.findOne({ where: { name: req.body.name } });

    if (roleIsExist) {
      const response = responseFormatter(
        CODE[422],
        SUCCESS.FALSE,
        MESSAGE.ROLE_UNIQUE,
        null,
      );
      return res.status(CODE[422]).send(response);
    }

    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
    const role = await Role.create(req.body);
    const { id } = role;
    const roleData = await Role.findByPk(id);
    const response = responseFormatter(
      CODE[201],
      SUCCESS.TRUE,
      MESSAGE.ROLE_CREATED,
      roleData,
    );
    return res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await Role.findAll({
      order: [['name', 'ASC']],
    });
    const data = {
      count: roles.length,
      rows: roles,
    };
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      data,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      const response = responseFormatter(
        CODE[404],
        SUCCESS.TRUE,
        MESSAGE.DATA_NOT_FOUND,
        role,
      );
      return res.status(200).send(response);
    }
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      role,
    );
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.EMPTY_CONTENT,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    const { id } = req.params;
    req.body.updatedBy = req.user.id;
    await Role.update(req.body, {
      where: { id },
    });
    const roleData = await Role.findByPk(id);
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.ROLE_UPDATED,
      roleData,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const findRolePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const roleData = await Role.findOne({ where: { id } });

    const permissions = await Permission.findAll();

    const rolePermissions = await RolePermission.findAll({
      where: { roleId: id },
      include: ['role', 'permission'],
    });
    const groupedPermission = groupBy(permissions, 'groupName');
    const keys = Object.keys(groupedPermission);
    const permissionIds = rolePermissions.map(
      (rolePermission: RolePermissionModel) => rolePermission.permissionId,
    );
    const newData = {
      rolePermissions,
      permissions: groupedPermission,
      keys,
      permissionIds,
      roleId: id,
      role: roleData,
    };
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      newData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const updateRolePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body && !req.params) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.EMPTY_CONTENT,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    const { permissionIds } = req.body;
    let query;
    if (permissionIds && permissionIds.length > 0) {
      query = {
        [Op.and]: [
          {
            permissionId: {
              [Op.notIn]: permissionIds,
            },
          },
          { roleId: req.params.id },
        ],
      };
    } else {
      query = { roleId: req.params.id };
    }
    await RolePermission.destroy({
      where: query,
    });
    let response;
    if (permissionIds && permissionIds.length > 0) {
      for (const id of permissionIds) {
        const data = await RolePermission.findOne({
          where: { [Op.and]: [{ roleId: req.params.id }, { permissionId: id }] },
        });

        if (data == null || !data) {
          const rolePermissionData: any = {
            roleId: req.params.id,
            permissionId: id,
            createdBy: req.user.id,
            updatedBy: req.user.id,
          };
          await RolePermission.create(rolePermissionData);
        }
      }
      const ids = await RolePermission.findAll({
        where: { roleId: req.user.roleId },
        attributes: ['permissionId'],
        raw: true,
      });
      const _permissionIds = ids.map((id) => id.permissionId);
      const permissions = await Permission.findAll({
        where: { id: { [Op.in]: _permissionIds } },
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
          'email'
        ],
        where: { id: req.user.id },
      });

      const userAndPermissions = {
        userData,
        permissions: groupedPermission,
      };
      response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.PERMISSION_UPDATED,
        userAndPermissions,
      );
    } else {
      response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.SUCCESS,
        null,
      );
    }
    return res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  findAll,
  findById,
  update,
  findRolePermissions,
  updateRolePermissions,
};
