import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import SalesDebitTransactionModel from '../interfaces/masters/salesDebitTransaction.interface';
import BusinessTransaction from './business-transaction';
import GlAccount from './gl-account';
import PostingKey from './posting-key';
import ProfitCentre from './profit-centre';
import DocumentType from './document-type';

const SalesDebitTransaction = sequelize.define<SalesDebitTransactionModel>(
  'sales_debit_transaction',
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
    documentTypeId: {
      allowNull: false,
      type: DataTypes.STRING(16),
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
  },
);

SalesDebitTransaction.belongsTo(BusinessTransaction, {
  foreignKey: 'businessTransactionId',
});
SalesDebitTransaction.belongsTo(GlAccount, {
  foreignKey: 'glAccountId',
});
SalesDebitTransaction.belongsTo(DocumentType, {
  foreignKey: 'documentTypeId',
});
SalesDebitTransaction.belongsTo(PostingKey, {
  foreignKey: 'postingKeyId',
});
SalesDebitTransaction.belongsTo(ProfitCentre, {
  foreignKey: 'profitCentreId',
});

export default SalesDebitTransaction;
