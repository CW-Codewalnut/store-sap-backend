import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import CashJournalModel from '../interfaces/masters/cashJournal.interface';

const CashJournal = sequelize.define<CashJournalModel>('cash_journal', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  cashJournalNo: {
    allowNull: false,
    unique: true,
    type: DataTypes.BIGINT,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  currency: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: false,
  },
  plantId: {
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
});

export default CashJournal;
