const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const rolePermission = sequelize.define('role_permission', {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    roleId: {
      allowNull: true,
      type: Sequelize.STRING(16),
    },
    permissionId: {
      allowNull: true,
      type: Sequelize.STRING(16),
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.STRING(16),
    },
    updatedBy: {
      allowNull: true,
      type: Sequelize.STRING(16),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  rolePermission.associate = (models) => {
    rolePermission.belongsTo(models.role, {
      foreignKey: 'roleId',
    });
    rolePermission.belongsTo(models.permission, {
      foreignKey: 'permissionId',
    });
  };
  sequelizeTransforms(rolePermission);
  return rolePermission;
};
