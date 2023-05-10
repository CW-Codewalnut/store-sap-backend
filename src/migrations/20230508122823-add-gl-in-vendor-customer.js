module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'glAccountId', {
      type: Sequelize.STRING(16),
      allowNull: true,
      references: {
        model: 'gl_accounts',
        key: 'id',
      },
    });
    await queryInterface.addColumn('vendors', 'glAccountId', {
      type: Sequelize.STRING(16),
      allowNull: true,
      references: {
        model: 'gl_accounts',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('vendors', 'glAccountId');
    await queryInterface.removeColumn('customers', 'glAccountId');
  },
};
