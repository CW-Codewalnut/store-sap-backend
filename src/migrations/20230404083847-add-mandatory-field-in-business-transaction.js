module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('business_transactions', 'vendorField', {
      type: Sequelize.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    });
    await queryInterface.addColumn('business_transactions', 'customerField', {
      type: Sequelize.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    });
    await queryInterface.addColumn('business_transactions', 'houseBankField', {
      type: Sequelize.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('business_transactions', 'vendorField');
    await queryInterface.removeColumn('business_transactions', 'customerField');
    await queryInterface.removeColumn(
      'business_transactions',
      'houseBankField',
    );
  },
};
