module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      employeeCode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        references: {
          model: 'employees',
          key: 'employeeCode',
        },
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      password: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING(100),
      },
      roleId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'roles',
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
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
  // eslint-disable-next-line arrow-parens
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
