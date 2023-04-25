import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import BusinessTransaction from './business-transaction';
import GlAccountModel from '../interfaces/masters/glAccount.interface';

const GlAccount = sequelize.define<GlAccountModel>('gl_account', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  glAccounts: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  shortText: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  longText: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  businessTransactionId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    references: {
      model: 'business_transactions',
      key: 'id',
    },
  },
  venderGl: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  customerGl: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  houseBankMandatory: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

GlAccount.belongsTo(BusinessTransaction, {
  foreignKey: 'businessTransactionId',
});

export default GlAccount;
