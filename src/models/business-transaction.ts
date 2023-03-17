import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Module from './module';

interface BusinessTransactionModel
  extends Model<
    InferAttributes<BusinessTransactionModel>,
    InferCreationAttributes<BusinessTransactionModel>
  > {
  id: string;
  businessTransactionNo: number;
  shortText: string;
  longText: string;
  moduleId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
