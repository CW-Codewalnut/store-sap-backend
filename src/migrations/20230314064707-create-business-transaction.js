module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      businessTransactionNo: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        unique: true,
      },
      shortText: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },
      longText: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      moduleId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'modules',
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
    await queryInterface.dropTable('business_transactions');
  },
};
