import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import Plant from './plant';

interface CostCentreModel
  extends Model<
    InferAttributes<CostCentreModel>,
    InferCreationAttributes<CostCentreModel>
  > {
  id: string;
  costCentre: number;
  sapDescription: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
