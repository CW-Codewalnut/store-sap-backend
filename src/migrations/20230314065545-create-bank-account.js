module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      bankAccountNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      AccountType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      houseBankId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'house_banks',
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
    await queryInterface.dropTable('bank_accounts');
  },
};
