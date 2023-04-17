module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessions', 'isAllowedNewTransaction', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Sessions', 'isAllowedNewTransaction');
  },
};
