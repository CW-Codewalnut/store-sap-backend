import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ProfitCentre from './profit-centre';
import SegmentModel from '../interfaces/masters/segment.interface';

const Segment = sequelize.define<SegmentModel>('segment', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  segment: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  profitCentreId: {
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

Segment.belongsTo(ProfitCentre, {
  foreignKey: 'profitCentreId',
});

export default Segment;
