module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses_debit_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      expensesHeaderId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'expenses_headers',
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
      specialGlIndicatorId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'special_gl_indicators',
          key: 'id',
        },
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(13, 2),
      },
      taxCodeId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'tax_codes',
          key: 'id',
        },
      },
      businessPlaceId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'business_places',
          key: 'id',
        },
      },
      costCentreId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'cost_centres',
          key: 'id',
        },
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
    await queryInterface.dropTable('expenses_debit_transactions');
  },
};
