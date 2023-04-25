module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('gl_accounts', 'venderGl', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('gl_accounts', 'customerGl', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('gl_accounts', 'houseBankMandatory', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('gl_accounts', 'venderGl');
    await queryInterface.removeColumn('gl_accounts', 'customerGl');
    await queryInterface.removeColumn('gl_accounts', 'houseBankMandatory');
  },
};
