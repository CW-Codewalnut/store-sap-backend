import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PlantModel from '../interfaces/masters/plant.interface';

const Plant = sequelize.define<PlantModel>('plant', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  plantCode: {
    allowNull: false,
    unique: true,
    type: DataTypes.BIGINT,
  },
  plant: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING(100),
    validate: {
      notNull: {
        msg: 'Plant is required!',
      },
      len: {
        args: [3, 50],
        msg: 'Plant must be under 3-50 characters.',
      },
    },
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

export default Plant;
