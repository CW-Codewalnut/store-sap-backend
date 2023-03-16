import { Request, Response } from 'express';
import groupBy from 'lodash.groupby';
import { Op } from 'sequelize';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/role-permission';
import { responseFormatter, CODE, STATUS } from '../config/response';

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      const response = responseFormatter(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
    const role = await Role.create(req.body);
    const { id } = role;
    const roleData = await Role.findByPk(id);
    const response = responseFormatter(
      CODE[201],
      STATUS.SUCCESS,
      'Created',
      roleData,
    );
    return res.status(201).send(response);
  } catch (err) {
    const response = responseFormatter(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.status(CODE[500]).send(response);
  }
};

const findAll = async (req: Request, res: Response) => {
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
      STATUS.SUCCESS,
      'Fetched',
      data,
    );
    res.status(200).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      const response = responseFormatter(
        CODE[404],
        STATUS.SUCCESS,
        'Data not found',
        role,
      );
      return res.status(200).send(response);
    }
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      role,
    );
    return res.status(200).send(response);
  } catch (err) {
    const response = responseFormatter(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.status(CODE[500]).send(response);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      const response = responseFormatter(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
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
      STATUS.SUCCESS,
      'Updated',
      roleData,
    );
    return res.status(CODE[200]).send(response);
  } catch (err) {
    const response = responseFormatter(
      CODE[500],
      STATUS.FAILURE,
      JSON.stringify(err),
      null,
    );
    return res.status(CODE[500]).send(response);
  }
};

const findRolePermissions = async (req: Request, res: Response) => {
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
      (rolePermission: any) => rolePermission.permissionId,
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
      STATUS.SUCCESS,
      'Fetched',
      newData,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(500).send(response);
  }
};

const updateRolePermissions = (req: Request, res: Response) => {
  try {
    if (!req.body && !req.params) {
      const response = responseFormatter(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
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
    RolePermission.destroy({
      where: query,
    });
    let response;
    if (permissionIds && permissionIds.length > 0) {
      permissionIds.forEach(async (id: string) => {
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
          RolePermission.create(rolePermissionData);
        }
      });
      response = responseFormatter(CODE[200], STATUS.SUCCESS, 'success', null);
    } else {
      response = responseFormatter(CODE[200], STATUS.SUCCESS, 'success', null);
    }
    return res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    return res.status(CODE[500]).send(response);
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
