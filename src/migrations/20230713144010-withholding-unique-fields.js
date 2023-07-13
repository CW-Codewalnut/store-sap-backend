module.exports = {
  async up(queryInterface) {
    queryInterface.addConstraint('withholding_taxes', {
      fields: ['withholdingType', 'taxCode'],
      type: 'unique',
      name: 'unique_withholdingType_taxCode',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'withholding_taxes',
      'unique_withholdingType_taxCode',
    );
  },
};
