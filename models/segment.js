const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const segment = sequelize.define('segment', {
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
    profitCentreId: {
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
  segment.associate = (models) => {
    segment.belongsTo(models.profit_centre, {
      foreignKey: 'profitCentreId',
    });
  };
  sequelizeTransforms(segment);
  return segment;
};
