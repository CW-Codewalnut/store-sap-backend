import { Request, Response } from 'express';
import lodash from 'lodash';
import { Op } from 'sequelize';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/role-permission';
import { format, CODE, STATUS } from '../config/response';

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.name || !req.body.description) {
      const response = format(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }
    // req.body.createdBy = req.user.id;
    // req.body.updatedBy = req.user.id;
    const role = await Role.create(req.body);
    const { id } = role;
    const roleData = await Role.findByPk(id);
    const response = format(CODE[201], STATUS.SUCCESS, 'Created', roleData);
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

const findAll = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      order: [['name', 'ASC']],
    });

    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', roles);
    res.status(200).send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      const response = format(
        CODE[404],
        STATUS.SUCCESS,
        'Data not found',
        role,
      );
      return res.status(200).send(response);
    }
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', role);
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
    if (!req.body || !req.body.name || !req.body.description) {
      const response = format(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }
    const { id } = req.params;
    // req.body.updatedBy = req.user.id;
    await Role.update(req.body, {
      where: { id },
    });
    const roleData = await Role.findByPk(id);
    const response = format(CODE[200], STATUS.SUCCESS, 'Updated', roleData);
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

const findRolePermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const roleData = await Role.findOne({ where: { id } });

    const permissions = await Permission.findAll();

    const data = await RolePermission.findAll({
      where: { roleId: id },
      include: ['role', 'permission'],
    });
    const groupedPermission = lodash.groupBy(permissions, 'groupName');
    const keys = Object.keys(groupedPermission);
    const permissionIds = data.map((i: any) => i.permissionId);
    const newData = {
      data,
      permissions: groupedPermission,
      keys,
      permissionIds,
      roleId: id,
      role: roleData,
    };
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', newData);
    res.send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.status(400).send(response);
  }
};

const updateRolePermissions = (req: Request, res: Response) => {
  try {
    if (!req.body && !req.params) {
      const response = format(
        CODE[400],
        STATUS.FAILURE,
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }
    const { permissions } = req.body;
    let query;
    if (permissions && permissions.length > 0) {
      query = {
        [Op.and]: [
          {
            permissionId: {
              [Op.notIn]: permissions,
            },
          },
          { roleId: req.body.id },
        ],
      };
    } else {
      query = { roleId: req.params.id };
    }
    RolePermission.destroy({
      where: query,
    });
    let response;
    if (permissions && permissions.length > 0) {
      permissions.forEach(async (id: string) => {
        const obj = {
          roleId: req.params.id,
          permissionId: id,
          // createdBy: req.user.id,
          // updatedBy: req.user.id,
        };

        const data = await RolePermission.findOne({
          where: { [Op.and]: [{ roleId: req.params.id }, { permissionId: id }] },
        });

        if (data == null || !data) {
          RolePermission.create(obj);
        }
      });
      response = format(CODE[200], STATUS.SUCCESS, 'success', null);
    } else {
      response = format(CODE[200], STATUS.SUCCESS, 'success', null);
    }
    return res.send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    return res.send(response);
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
