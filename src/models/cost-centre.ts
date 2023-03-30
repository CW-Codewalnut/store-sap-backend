import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Plant from './plant';
import CostCentreModel from '../interfaces/masters/costCentre.interface';

const CostCentre = sequelize.define<CostCentreModel>('cost_centre', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  costCentre: {
    allowNull: false,
    unique: true,
    type: DataTypes.BIGINT,
  },
  sapDescription: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(100),
  },
  plantId: {
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
CostCentre.belongsTo(Plant, {
  foreignKey: 'plantId',
});

export default CostCentre;
