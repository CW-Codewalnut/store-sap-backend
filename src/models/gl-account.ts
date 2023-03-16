import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import BusinessTransaction from './business-transaction';

interface GlAccountModel
  extends Model<
    InferAttributes<GlAccountModel>,
    InferCreationAttributes<GlAccountModel>
  > {
  id: string;
  glAccounts: number;
  shortText: string;
  longText: string;
  businessTransactionId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    unique: true,
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
