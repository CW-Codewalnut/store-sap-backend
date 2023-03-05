module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      userId: Sequelize.STRING,
      expires: Sequelize.DATE,
      data: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Session');
  },
};
