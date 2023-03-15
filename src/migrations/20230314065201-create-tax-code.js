module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tax_codes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      taxCode: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      taxRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      groupName: {
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
    await queryInterface.dropTable('tax_codes');
  },
};
