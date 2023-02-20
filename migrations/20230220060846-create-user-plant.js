module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_plants', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'users',
          key: 'id',
        },
      },
      plantId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'plants',
          key: 'id',
        },
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
    await queryInterface.dropTable('user-plants');
  },
};
