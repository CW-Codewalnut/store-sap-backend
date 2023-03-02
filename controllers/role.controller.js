const _ = require('lodash');
const Role = require('../models').role;
const Permission = require('../models').permission;
const RolePermission = require('../models').role_permission;
const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');

const db = require('../models');

const { Op } = db;

module.exports.create = async (req, res) => {
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
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
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

module.exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['name', 'ASC']],
    });

    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', roles);
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

module.exports.findById = async (req, res) => {
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

module.exports.update = async (req, res) => {
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
    req.body.updatedBy = req.user.id;
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

module.exports.findRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const roleData = await Role.findOne({ where: { id } });

    const permissions = await Permission.findAll();

    const data = await RolePermission.findAll({
      where: { roleId: id },
      include: ['role', 'permission'],
    });
    const groupedPermission = _.groupBy(permissions, 'groupName');
    const keys = Object.keys(groupedPermission);
    const permissionIds = data.map((i) => i.permissionId);
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
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.status(400).send(response);
  }
};
