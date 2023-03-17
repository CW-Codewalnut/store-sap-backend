import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';

interface PaymentTermModel
  extends Model<
    InferAttributes<PaymentTermModel>,
    InferCreationAttributes<PaymentTermModel>
  > {
  id: string;
  payTerm: string;
  payTermDescription: string;
  netDueDate: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentTerm = sequelize.define<PaymentTermModel>('payment_term', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  payTerm: {
    type: DataTypes.STRING(5),
    allowNull: false,
    unique: true,
  },
  payTermDescription: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  netDueDate: {
    type: DataTypes.STRING(100),
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

export default PaymentTerm;
