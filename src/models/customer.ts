import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PaymentTerm from './payment-term';
import CustomerModel from '../interfaces/masters/customer.interface';
import GlAccount from './gl-account';

const Customer = sequelize.define<CustomerModel>('customer', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  title: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title is required!',
      },
      len: {
        args: [2, 10],
        msg: 'Title must be under 3-10 characters.',
      },
    },
  },
  customerNo: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Customer number is required!',
      },
    },
  },
  customerName1: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  customerName2: {
    type: DataTypes.STRING(36),
    allowNull: true,
  },
  customerName3: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  houseDescription: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  street1: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  street2: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  telephone: {
    type: DataTypes.STRING(12),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  email1: {
    type: DataTypes.STRING(100),
    defaultValue: null,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email address!',
      },
    },
  },
  email2: {
    type: DataTypes.STRING(100),
    defaultValue: null,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email address!',
      },
    },
  },
  contactPerson: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  gstNo: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  pan: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  paymentTermId: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  currentCreditLimit: {
    type: DataTypes.STRING(21),
    allowNull: true,
  },
  customerType: {
    type: DataTypes.STRING(21),
    allowNull: true,
  },
  glAccountId: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
});

Customer.belongsTo(PaymentTerm, {
  foreignKey: 'paymentTermId',
});

Customer.belongsTo(GlAccount, {
  foreignKey: 'glAccountId',
});

export default Customer;
