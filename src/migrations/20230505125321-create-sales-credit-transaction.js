module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_credit_transactions', {
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
      customerId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'customers',
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
      baselineDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      assignment: {
        allowNull: true,
        type: Sequelize.STRING(18),
      },
      text: {
        allowNull: true,
        type: Sequelize.STRING(25),
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardType: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Debit/credit card receipt',
      },
      cardSubType: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Debit/credit card receipt',
      },
      terminalId: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Debit/credit card receipt',
      },
      remitterName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'All, except cash receipt',
      },
      RemitterContactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'All, except cash receipt',
      },
      UpiDetails: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'UPI receipt',
      },
      qrCode: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'UPI receipt',
      },
      rtgsOrNeftDetails: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Bank Transfer',
      },
      customerBankName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Bank Transfer',
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
    await queryInterface.dropTable('sales_credit_transactions');
  },
};
