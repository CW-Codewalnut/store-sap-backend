module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessions', 'activePlantId', {
      type: Sequelize.STRING(16),
      defaultValue: null,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Sessions', 'activePlantId');
  },
};
