module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'accountStatus', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'accountStatus');
  },
};
