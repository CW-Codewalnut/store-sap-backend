import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Module from './module';
import BusinessTransactionModel from '../interfaces/masters/businessTransaction.interface';

const BusinessTransaction = sequelize.define<BusinessTransactionModel>(
  'business_transaction',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    businessTransactionNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    shortText: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    longText: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    moduleId: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    vendorField: {
      type: DataTypes.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    },
    customerField: {
      type: DataTypes.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    },
    houseBankField: {
      type: DataTypes.ENUM('Required', 'Disabled', 'Optional'),
      allowNull: false,
      defaultValue: 'Optional',
    },
    createdBy: {
      allowNull: true,
      type: DataTypes.STRING(16),
    },
    updatedBy: {
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

BusinessTransaction.belongsTo(Module, {
  foreignKey: 'moduleId',
});

export default BusinessTransaction;
