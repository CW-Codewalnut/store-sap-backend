const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const role = sequelize.define('role', {
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
    user_code: {
      type: Sequelize.STRING(100),
      defaultValue: null,
      allowNull: true,
      trim: true,
      validate: {
        len: {
          args: [3, 50],
          msg: 'User code must be under 3-50 characters.',
        },
      },
    },
    email: {
      type: Sequelize.STRING(100),
      defaultValue: null,
      trim: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email address!',
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
          msg: 'Invalid password..try again.',
        },
      },
    },
    mobile: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      trim: true,
      validate: {
        notNull: {
          msg: 'Mobile number is required!',
        },
        len: {
          args: [13, 13],
          msg: 'Invalid mobile number!',
        },
      },
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: true,
      trim: true,
    },
    wareHouseId: {
      type: Sequelize.BIGINT,
      defaultValue: null,
      allowNull: true,
      trim: true,
    },
    roleMasterId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      trim: true,
      validate: {
        notNull: {
          msg: 'Role is required!',
        },
      },
    },
    reportingHeadId: {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
      trim: true,
    },
    passwordApplied: {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
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
  sequelizeTransforms(role);
  return role;
};
