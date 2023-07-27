module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses_headers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      documentStatus: {
        allowNull: false,
        type: Sequelize.STRING(20),
        defaultValue: 'Saved',
      },
      postingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sapDocNo: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      documentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentHeaderText: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      plantId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'plants',
          key: 'id',
        },
      },
      reversalId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'expenses_headers',
          key: 'id',
        },
      },
      companyCode: {
        allowNull: false,
        type: Sequelize.STRING(4),
        defaultValue: '1000',
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING(8),
        defaultValue: 'INR',
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
    await queryInterface.dropTable('expenses_headers');
  },
};
