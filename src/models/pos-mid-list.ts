import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PosMidListModel from '../interfaces/masters/posMidList.interface';

const PosMidList = sequelize.define<PosMidListModel>('pos_mid_list', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  meCode: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
  },
  tid: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  legalName: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dbaName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  pin: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING(20),
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

export default PosMidList;
