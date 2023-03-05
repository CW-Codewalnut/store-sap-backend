import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Plant from './plant';

interface CostCentreModel
  extends Model<
    InferAttributes<CostCentreModel>,
    InferCreationAttributes<CostCentreModel>
  > {
  id: string;
  sapMasterId: string;
  name: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

const CostCentre = sequelize.define<CostCentreModel>('cost_centre', {
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
