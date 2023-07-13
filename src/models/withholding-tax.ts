import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import WithholdingTaxModel from '../interfaces/masters/withholdingTax.interface';

const WithholdingTax = sequelize.define<WithholdingTaxModel>(
  'withholding_tax',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    taxCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    tdsSection: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    tdsRates: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gl: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    withholdingType: {
      type: DataTypes.ENUM('TDS', 'TCS'),
      allowNull: false,
      defaultValue: 'TDS',
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

export default WithholdingTax;
