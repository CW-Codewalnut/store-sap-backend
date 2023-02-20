const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const permission = sequelize.define('permission', {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      trim: true,
      validate: {
        notNull: {
          msg: 'Name is required!',
        },
        len: {
          args: [3, 50],
          msg: 'Name must be under 3-50 characters.',
        },
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    groupName: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    },
    created_by: {
      type: Sequelize.STRING(16),
      allowNull: false,
    },
    updated_by: {
      type: Sequelize.STRING(16),
      allowNull: false,
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
  sequelizeTransforms(permission);
  return permission;
};
