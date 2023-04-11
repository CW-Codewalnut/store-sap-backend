module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_terms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      payTerm: {
        type: Sequelize.STRING(5),
        allowNull: false,
        unique: true,
      },
      payTermDescription: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      netDueDate: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
    await queryInterface.dropTable('payment_terms');
  },
};
