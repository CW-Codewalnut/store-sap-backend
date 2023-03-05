import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import CostCentre from './cost-centre';

interface ProfitCentreModel
  extends Model<
    InferAttributes<ProfitCentreModel>,
    InferCreationAttributes<ProfitCentreModel>
  > {
  id: string;
  sapMasterId: string;
  name: string;
  costCentreId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

const ProfitCentre = sequelize.define<ProfitCentreModel>('profit_centre', {
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
