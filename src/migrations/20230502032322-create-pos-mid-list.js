module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pos_mid_lists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      meCode: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true,
      },
      tid: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      legalName: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dbaName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      pin: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.STRING(16),
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.STRING(16),
      },
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
    await queryInterface.dropTable('pos_mid_lists');
  },
};
