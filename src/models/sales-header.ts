import {DataTypes} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import SalesHeaderModel from '../interfaces/masters/salesHeader.interface';
import Plant from './plant';

const SalesHeader = sequelize.define<SalesHeaderModel>('sales_header', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  documentStatus: {
    allowNull: false,
    type: DataTypes.STRING(20),
    defaultValue: 'Saved',
  },
  postingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sapDocNo: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  documentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentHeaderText: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  plantId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  cashLedgerId: {
    allowNull: false,
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

SalesHeader.belongsTo(Plant, {
  foreignKey: 'plantId',
});

export default SalesHeader;
