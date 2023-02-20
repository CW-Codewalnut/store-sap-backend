const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const plant = sequelize.define('plant', {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    sapMasterId: {
      allowNull: false,
      unique: true,
      type: Sequelize.INTEGER(10),
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
  sequelizeTransforms(plant);
  return plant;
};
