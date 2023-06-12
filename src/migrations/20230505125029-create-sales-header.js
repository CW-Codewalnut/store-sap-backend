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
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      documentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentHeaderText: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      plantId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
      },
      cashLedgerId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'cash_ledgers',
          key: 'id',
        },
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
