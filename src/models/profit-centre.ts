import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import CostCentre from './cost-centre';
import ProfitCentreModel from '../interfaces/masters/profitCentre.interface';

const ProfitCentre = sequelize.define<ProfitCentreModel>('profit_centre', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  profitCentre: {
    allowNull: false,
    unique: true,
    type: DataTypes.BIGINT,
  },
  sapDescription: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  costCentreId: {
    allowNull: true,
    type: DataTypes.STRING(16),
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

ProfitCentre.belongsTo(CostCentre, {
  foreignKey: 'costCentreId',
});

export default ProfitCentre;
