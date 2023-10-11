module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_denominations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      plantId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'plants',
          key: 'id',
        },
      },
      cashJournalId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'cash_journals',
          key: 'id',
        },
      },
      denominationTotalAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(21, 2),
      },
      qty1INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty2INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty5INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty10INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty20INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty50INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty100INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty200INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty500INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      qty2000INR: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('cash_denominations');
  },
};
