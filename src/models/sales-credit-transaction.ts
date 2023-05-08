import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import SalesCreditTransactionModel from '../interfaces/masters/salesCreditTransaction.interface';
import MESSAGE from '../config/message.json';

const SalesCreditTransaction = sequelize.define<SalesCreditTransactionModel>('sales_credit_transaction', {
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
  customerId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.CUSTOMER_INVALID,
      },
    },
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
  baselineDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
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

export default SalesCreditTransaction;
