module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses_credit_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      salesHeaderId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'expenses_headers',
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
      sectionCodeId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'section_codes',
          key: 'id',
        },
      },
      withholdingTaxId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'withholding_taxes',
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
    await queryInterface.dropTable('expenses_credit_transactions');
  },
};
