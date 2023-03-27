import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';

interface PreferenceModel
  extends Model<
    InferAttributes<PreferenceModel>,
    InferCreationAttributes<PreferenceModel>
  > {
  id: string;
  name: string;
  value: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const Preference = sequelize.define<PreferenceModel>('preference', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
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

export default Preference;
