module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cost_centres', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      sapMasterId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER(10),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('cost-centres');
  },
};
