module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('house_banks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      ifsc: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      bankName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      street: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      bankBranch: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('house_banks');
  },
};
