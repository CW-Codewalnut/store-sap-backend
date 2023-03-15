import {nanoid} from 'nanoid';
import {DataTypes} from 'sequelize';
import {sequelize} from '.';

const TaxCode = sequelize.define('tax-code', {
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
