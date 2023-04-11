module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session_activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      userId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('session_activities');
  },
};
