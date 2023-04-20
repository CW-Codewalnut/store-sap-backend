module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('cash_denominations', {
      fields: ['plantId', 'cashJournalId'],
      type: 'unique',
      name: 'unique_plantId_cashJournalId',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'cash_denominations',
      'unique_plantId_cashJournalId',
    );
  },
};
