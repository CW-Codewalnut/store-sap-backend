module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gl_accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      glAccounts: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        unique: true,
      },
      shortText: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        unique: true,
      },
      longText: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        unique: true,
      },
      glTypeId: {
        allowNull: false,
        type: Sequelize.STRING(16),
      },
      businessTransactionId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'business_transactions',
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
    await queryInterface.dropTable('gl_accounts');
  },
};
