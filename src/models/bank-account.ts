import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import HouseBank from './house-bank';

interface BankAccountModel
  extends Model<
    InferAttributes<BankAccountModel>,
    InferCreationAttributes<BankAccountModel>
  > {
  id: string;
  bankAccountNumber: string;
  AccountType: string;
  houseBankId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
