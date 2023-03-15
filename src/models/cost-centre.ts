import {DataTypes} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import Plant from './plant';

const CostCentre = sequelize.define('cost_centre', {
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
