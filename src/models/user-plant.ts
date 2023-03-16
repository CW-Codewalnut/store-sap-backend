import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import User from './user';
import Plant from './plant';

interface UserPlantModel
  extends Model<
    InferAttributes<UserPlantModel>,
    InferCreationAttributes<UserPlantModel>
  > {
  id: string;
  userId: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPlant = sequelize.define<UserPlantModel>('plant', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  userId: {
    allowNull: true,
    type: DataTypes.STRING(16),
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
UserPlant.belongsTo(User, {
  foreignKey: 'userId',
});
UserPlant.belongsTo(Plant, {
  foreignKey: 'plantId',
});
export default UserPlant;
