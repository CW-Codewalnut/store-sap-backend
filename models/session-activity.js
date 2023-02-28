const { nanoid } = require('nanoid');
const sequelizeTransforms = require('sequelize-transforms');

module.exports = (sequelize, Sequelize) => {
  const sessionActivity = sequelize.define(
    'session_activity',
    {
      id: {
        type: Sequelize.STRING(16),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid(16),
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      loginTime: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When a row is created, the login time is logged',
      },
      logoutTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isExpired: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      device: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ip: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      long: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      createdAt: 'loginTime',
    },
  );
  sessionActivity.associate = (models) => {
    sessionActivity.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  sequelizeTransforms(sessionActivity);
  return sessionActivity;
};
