module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_debit_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      salesHeaderId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'sales_headers',
          key: 'id',
        },
      },
      businessTransactionId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'business_transactions',
          key: 'id',
        },
      },
      glAccountId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'gl_accounts',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postingKeyId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'posting_keys',
          key: 'id',
        },
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(13, 2),
      },
      profitCentreId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'profit_centres',
          key: 'id',
        },
      },
      assignment: {
        allowNull: true,
        type: Sequelize.STRING(18),
      },
      text: {
        allowNull: true,
        type: Sequelize.STRING(25),
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
    await queryInterface.dropTable('sales_debit_transactions');
  },
};
