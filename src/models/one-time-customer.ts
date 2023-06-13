import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import OneTimeCustomerModel from '../interfaces/masters/oneTimeCustomer.interface';

const OneTimeCustomer = sequelize.define<OneTimeCustomerModel>(
  'one_time_customer',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    salesHeaderId: {
      allowNull: false,
      type: DataTypes.STRING(16),
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
    languageKey: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'EN',
    },
    name: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    PostalCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'IN',
    },
    gstNumber: {
      allowNull: true,
      type: DataTypes.STRING(15),
    },
    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      defaultValue: null,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address!',
        },
      },
    },
    bankKey: {
      allowNull: true,
      type: DataTypes.STRING(20),
    },
    bankAccountNumber: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    bankCountry: {
      allowNull: true,
      type: DataTypes.STRING(15),
    },
    reference: {
      allowNull: true,
      type: DataTypes.STRING(30),
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
  },
);

export default OneTimeCustomer;
