import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import SalesCreditTransactionModel from '../interfaces/masters/salesCreditTransaction.interface';
import MESSAGE from '../config/message.json';
import Customer from './customer';
import PostingKey from './posting-key';
import PosMidList from './pos-mid-list';

const SalesCreditTransaction = sequelize.define<SalesCreditTransactionModel>(
  'sales_credit_transaction',
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
    assignment: {
      allowNull: true,
      type: DataTypes.STRING(18),
    },
    text: {
      allowNull: true,
      type: DataTypes.STRING(25),
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Debit/credit card receipt',
    },
    cardSubType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Debit/credit card receipt',
    },
    posMidId: {
      type: DataTypes.STRING(16),
      allowNull: true,
      comment: 'Debit/credit card receipt',
    },
    remitterName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'All except cash receipt',
    },
    RemitterContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'All except cash receipt',
    },
    UpiDetails: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'UPI receipt',
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'UPI receipt',
    },
    rtgsOrNeftDetails: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank Transfer',
    },
    customerBankName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank Transfer',
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

SalesCreditTransaction.belongsTo(Customer, {
  foreignKey: 'customerId',
});

SalesCreditTransaction.belongsTo(PostingKey, {
  foreignKey: 'postingKeyId',
});

SalesCreditTransaction.belongsTo(PosMidList, {
  foreignKey: 'posMidId',
});

SalesCreditTransaction.belongsTo(Customer, {
  foreignKey: 'customerId',
});

SalesCreditTransaction.belongsTo(PostingKey, {
  foreignKey: 'postingKeyId',
});

SalesCreditTransaction.belongsTo(PosMidList, {
  foreignKey: 'posMidId',
});

export default SalesCreditTransaction;
