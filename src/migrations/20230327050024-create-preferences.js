module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preferences', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      value: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('preferences');
  },
};
