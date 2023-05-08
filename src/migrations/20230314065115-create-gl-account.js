module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gl_accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      glAccounts: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      shortText: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      longText: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      businessTransactionId: {
        allowNull: true,
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
