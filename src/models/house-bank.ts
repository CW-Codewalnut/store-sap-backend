import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';

interface HouseBankModel
  extends Model<
    InferAttributes<HouseBankModel>,
    InferCreationAttributes<HouseBankModel>
  > {
  id: string;
  ifsc: string;
  bankName: string;
  street: string;
  city: string;
  bankBranch: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const HouseBank = sequelize.define<HouseBankModel>('house_bank', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  ifsc: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  street: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  bankBranch: {
    type: DataTypes.STRING(50),
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

export default HouseBank;
