module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posting_keys', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      postingKey: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountType: {
        type: Sequelize.ENUM('Credit', 'Debit'),
        allowNull: false,
      },
      groupName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      postingKeyReversalId: {
        allowNull: true,
        type: Sequelize.STRING(16),
        references: {
          model: 'posting_keys',
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
    await queryInterface.dropTable('posting_keys');
  },
};
