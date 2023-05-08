import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import SalesDebitTransactionModel from '../interfaces/masters/salesDebitTransaction.interface';

const SalesDebitTransaction = sequelize.define<SalesDebitTransactionModel>('sales_debit_transaction', {
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
  businessTransactionId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  glAccountId: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postingKeyId: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  amount: {
    allowNull: false,
    type: DataTypes.DECIMAL(13, 2),
  },
  profitCentreId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  assignment: {
    allowNull: true,
    type: DataTypes.STRING(18),
  },
  text: {
    allowNull: true,
    type: DataTypes.STRING(25),
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

export default SalesDebitTransaction;
