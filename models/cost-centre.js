const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const costCentre = sequelize.define('cost_centre', {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    sapMasterId: {
      allowNull: false,
      unique: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    plantId: {
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
  costCentre.associate = (models) => {
    costCentre.belongsTo(models.plant, {
      foreignKey: 'plantId',
    });
  };
  sequelizeTransforms(costCentre);
  return costCentre;
};
