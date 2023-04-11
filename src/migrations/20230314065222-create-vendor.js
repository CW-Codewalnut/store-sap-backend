module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      vendorNo: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      name1: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name2: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      searchTerm1: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      searchTerm2: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      street1: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      street2: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      street3: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      mobileNo: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentTermId: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'payment_terms',
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
    await queryInterface.dropTable('vendors');
  },
};
