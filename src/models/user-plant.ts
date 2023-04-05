import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import User from './user';
import Plant from './plant';
import UserPlantModel from '../interfaces/masters/userPlant.interface';

const UserPlant = sequelize.define<UserPlantModel>('user_plant', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  userId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  plantId: {
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

UserPlant.belongsTo(User, {
  foreignKey: 'userId',
});

UserPlant.belongsTo(Plant, {
  foreignKey: 'plantId',
});

export default UserPlant;
