'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      roleId: {
        type: Sequelize.STRING(16),
        allowNull: true,
        references:{
          model:'roles',
          key:'id',
        }
      },
      plantId: {
        type: Sequelize.STRING(16),
        allowNull: true,
        references:{
          model:'plants',
          key:'id',
        }
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};