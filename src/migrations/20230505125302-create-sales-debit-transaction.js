module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_headers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      documentStatus: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'Saved',
      },
      postingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sapDocNo: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      documentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      period: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      documentHeaderText: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('sales_headers');
  },
};
