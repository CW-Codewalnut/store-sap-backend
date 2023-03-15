module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      employeeCode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      employeeName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      division: {
        type: Sequelize.STRING(50),
        allowNull: true,
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
    await queryInterface.dropTable('employees');
  },
};
