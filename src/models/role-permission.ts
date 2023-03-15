import {DataTypes} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import Role from './role';
import Permission from './permission';

const RolePermission = sequelize.define('role_permission', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  roleId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  permissionId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  createdBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
});

RolePermission.belongsTo(Role, {
  foreignKey: 'roleId',
});
RolePermission.belongsTo(Permission, {
  foreignKey: 'permissionId',
});

export default RolePermission;
