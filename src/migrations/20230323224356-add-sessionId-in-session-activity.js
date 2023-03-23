module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('session_activities', 'sessionId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('session_activities', 'sessionId');
  },
};
