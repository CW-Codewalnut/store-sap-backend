'use strict';
const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16)
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      trim: true,
      validate: {
        notNull: {
          msg: "Name is required!",
        },
        len: {
          args: [3, 50],
          msg: "Name must be under 3-50 characters.",
        },
      },
    },
    email: {
      type: Sequelize.STRING(100),
      defaultValue: null,
      trim: true,
      unique: true,
      validate: { 
        isEmail: {
          args: true,
          msg: 'Invalid email address!'
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: null,
      trim: true,
      validate: {
        len: {
          args: [32, 32],
          msg: "Invalid password..try again.",
        },
      },
    },
    mobile: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
      trim: true,
      validate: {
        notNull: {
          msg: "Mobile number is required!",
        },
        len: {
          args: [10, 10],
          msg: "Invalid mobile number!",
        },
      },
    },
    roleId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    plantId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
  sequelizeTransforms(user);
  return user;
};