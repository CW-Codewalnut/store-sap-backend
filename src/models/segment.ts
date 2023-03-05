import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ProfitCentre from './profit-centre';

interface SegmentModel
  extends Model<
    InferAttributes<SegmentModel>,
    InferCreationAttributes<SegmentModel>
  > {
  id: string;
  sapMasterId: string;
  name: string;
  profitCentreId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

const Segment = sequelize.define<SegmentModel>('segment', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  sapMasterId: {
    allowNull: false,
    unique: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  profitCentreId: {
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

Segment.belongsTo(ProfitCentre, {
  foreignKey: 'profitCentreId',
});

export default Segment;
