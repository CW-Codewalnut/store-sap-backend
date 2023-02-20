const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const profitCentre = sequelize.define('profit_centre', {
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
      allowNull: false,
      type: Sequelize.STRING,
    },
    costCentreId: {
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
  profitCentre.associate = (models) => {
    profitCentre.belongsTo(models.cost_centre, {
      foreignKey: 'costCentreId',
    });
  };
  sequelizeTransforms(profitCentre);
  return profitCentre;
};
