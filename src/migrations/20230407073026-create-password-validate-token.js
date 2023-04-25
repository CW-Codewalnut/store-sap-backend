module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('password_validate_tokens', {
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
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isUsed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
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
    await queryInterface.dropTable('password_validate_tokens');
  },
};
