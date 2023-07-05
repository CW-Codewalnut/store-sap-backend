module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('one_time_customers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      salesHeaderId: {
        allowNull: false,
        type: Sequelize.STRING(16),
        references: {
          model: 'sales_headers',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      languageKey: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'EN',
      },
      name: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      PostalCode: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'IN',
      },
      gstNumber: {
        allowNull: true,
        type: Sequelize.STRING(15),
      },
      mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      bankKey: {
        allowNull: true,
        type: Sequelize.STRING(20),
      },
      bankAccountNumber: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      bankCountry: {
        allowNull: true,
        type: Sequelize.STRING(15),
      },
      reference: {
        allowNull: true,
        type: Sequelize.STRING(30),
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
    await queryInterface.dropTable('one_time_customers');
  },
};
