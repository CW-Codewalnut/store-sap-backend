import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import HouseBank from './house-bank';
import BankAccountModel from '../interfaces/masters/bankAccount.interface';

const BankAccount = sequelize.define<BankAccountModel>('bank_account', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  bankAccountNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  AccountType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  houseBankId: {
    type: DataTypes.STRING(16),
    allowNull: false,
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
});

BankAccount.belongsTo(HouseBank, {
  foreignKey: 'houseBankId',
});

export default BankAccount;
