import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PlantClosingDenominationModel from '../interfaces/masters/plantClosingDenomination.interface';

const PlantClosingDenomination = sequelize.define<PlantClosingDenominationModel>('plant_closing_denomination', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  plantId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  cashJournalId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  closingBalanceAmount: {
    allowNull: false,
    type: DataTypes.DECIMAL(21, 2),
  },
  denominationTotalAmount: {
    allowNull: false,
    type: DataTypes.DECIMAL(21, 2),
  },
  qty1INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty2INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty5INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty10INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty20INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty50INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty100INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty200INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty500INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  qty2000INR: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

export default PlantClosingDenomination;
