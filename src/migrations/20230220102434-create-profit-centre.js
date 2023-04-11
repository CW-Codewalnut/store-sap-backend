module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profit_centres', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      profitCentre: {
        allowNull: false,
        unique: true,
        type: Sequelize.BIGINT,
      },
      sapDescription: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      costCentreId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'cost_centres',
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
    await queryInterface.dropTable('profit-centres');
  },
};
