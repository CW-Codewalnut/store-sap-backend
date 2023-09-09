module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('withholding_taxes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      taxCode: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      tdsSection: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      tdsRates: {
        type: Sequelize.DECIMAL(13, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gl: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      withholdingType: {
        type: Sequelize.ENUM('TDS', 'TCS'),
        allowNull: false,
        defaultValue: 'TDS',
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
    await queryInterface.dropTable('withholding_taxes');
  },
};
