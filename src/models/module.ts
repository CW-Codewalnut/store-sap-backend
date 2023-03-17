import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';

interface ModuleModel
  extends Model<
    InferAttributes<ModuleModel>,
    InferCreationAttributes<ModuleModel>
  > {
  id: string;
  name: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const Module = sequelize.define<ModuleModel>('module', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  slug: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
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

export default Module;
