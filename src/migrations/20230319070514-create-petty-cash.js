module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petty_cashes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      pettyCashType: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      documentStatus: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'Saved',
      },
      businessTransactionId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'business_transactions',
          key: 'id',
        },
      },
      taxCodeId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'tax_codes',
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
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(21, 2),
      },
      netAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(21, 2),
      },
      taxRate: {
        allowNull: false,
        type: Sequelize.DECIMAL(21, 2),
      },
      taxBaseAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(21, 2),
      },
      bankAccountId: {
        type: Sequelize.STRING(16),
        allowNull: true,
        references: {
          model: 'bank_accounts',
          key: 'id',
        },
      },
      vendorId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'vendors',
          key: 'id',
        },
      },
      customerId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      receiptRecipient: {
        allowNull: true,
        type: Sequelize.STRING(35),
      },
      postingDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      documentDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      plantId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'plants',
          key: 'id',
        },
      },
      costCentreId: {
        allowNull: true,
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
      segmentId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'segments',
          key: 'id',
        },
      },
      cjDocNo: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      refDocNo: {
        allowNull: true,
        type: Sequelize.STRING(16),
      },
      orderNo: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      employeeId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      profitabilitySegmentNo: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      controllingArea: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      assets: {
        allowNull: true,
        type: Sequelize.STRING(30),
      },
      subNumber: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      referenceDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      transactionType: {
        allowNull: true,
        type: Sequelize.STRING(3),
      },
      assignment: {
        allowNull: true,
        type: Sequelize.STRING(18),
      },
      text: {
        allowNull: true,
        type: Sequelize.STRING(25),
      },
      additionalText1: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      additionalText2: {
        allowNull: true,
        type: Sequelize.STRING(30),
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
    await queryInterface.dropTable('petty_cashes');
  },
};
