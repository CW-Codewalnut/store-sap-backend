module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      roleId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      permissionId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'permissions',
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
    await queryInterface.dropTable('role-permissions');
  },
};
