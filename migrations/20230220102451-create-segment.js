module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('segments', {
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
      profitCentreId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'profit_centres',
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
    await queryInterface.dropTable('segments');
  },
};
