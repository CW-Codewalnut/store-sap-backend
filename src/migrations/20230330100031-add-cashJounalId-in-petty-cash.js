module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('petty_cashes', 'cashJournalId', {
      type: Sequelize.STRING(16),
      allowNull: true,
      references: {
        model: 'cash_journals',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('petty_cashes', 'cashJournalId');
  },
};
