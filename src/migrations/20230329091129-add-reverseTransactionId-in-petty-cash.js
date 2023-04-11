module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('petty_cashes', 'reverseTransactionId', {
      type: Sequelize.STRING(16),
      allowNull: true,
      references: {
        model: 'petty_cashes',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('petty_cashes', 'reverseTransactionId');
  },
};
