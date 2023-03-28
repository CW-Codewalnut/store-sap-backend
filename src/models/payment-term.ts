import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PaymentTermModel from '../interfaces/masters/paymentTerm.interface';

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
