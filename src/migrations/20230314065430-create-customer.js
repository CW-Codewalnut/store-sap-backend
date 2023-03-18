module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(16),
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      customerNo: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        unique: true,
      },
      customerName1: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      customerName2: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      customerName3: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      houseDescription: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: 'Door/Flat/Building/Room/Site no',
      },
      street1: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      street2: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      district: {
        type: Sequelize.STRING(36),
        allowNull: false,
        comment: 'District/Taluk/Village',
      },
      city: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      telephone: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      email1: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      email2: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      contactPerson: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gstNo: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      pan: {
        type: Sequelize.STRING(10),
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
      currentCreditLimit: {
        type: Sequelize.STRING(21),
        allowNull: true,
      },
      customerType: {
        type: Sequelize.STRING(30),
        allowNull: true,
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
    await queryInterface.dropTable('customers');
  },
};
