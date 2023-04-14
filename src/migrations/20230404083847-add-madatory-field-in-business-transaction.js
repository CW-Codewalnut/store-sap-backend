module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('business_transactions', 'vendorMandatory', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn(
      'business_transactions',
      'customerMandatory',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
    await queryInterface.addColumn('business_transactions', 'isExpenses', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'business_transactions',
      'vendorMandatory',
    );
    await queryInterface.removeColumn(
      'business_transactions',
      'customerMandatory',
    );
    await queryInterface.removeColumn('business_transactions', 'isExpenses');
  },
};
