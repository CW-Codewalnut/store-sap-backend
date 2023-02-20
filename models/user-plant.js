const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const userPlant = sequelize.define('user_plant', {
    id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    userId: {
      allowNull: true,
      type: Sequelize.STRING(16),
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
  userPlant.associate = (models) => {
    userPlant.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    userPlant.belongsTo(models.plant, {
      foreignKey: 'plantId',
    });
  };
  sequelizeTransforms(userPlant);
  return userPlant;
};
