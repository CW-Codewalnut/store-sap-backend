module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
      createdBy: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      updatedBy: {
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
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  },
};
