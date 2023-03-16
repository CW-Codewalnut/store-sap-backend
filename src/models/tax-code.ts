import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';

interface TaxCodeModel
  extends Model<
    InferAttributes<TaxCodeModel>,
    InferCreationAttributes<TaxCodeModel>
  > {
  id: string;
  taxCode: string;
  description: string;
  taxRate: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaxCode = sequelize.define<TaxCodeModel>('tax-code', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  taxCode: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  taxRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupName: {
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

export default TaxCode;
