module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_ledgers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      cashLedgerNo: {
        allowNull: false,
        unique: true,
        type: Sequelize.BIGINT,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      plantId: {
        type: Sequelize.STRING(16),
        allowNull: false,
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
    await queryInterface.dropTable('cash_ledgers');
  },
};
