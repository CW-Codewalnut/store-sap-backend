import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import SpecialGlIndicatorModel from '../interfaces/masters/specialGlIndicator.interface';

const SpecialGlIndicator = sequelize.define<SpecialGlIndicatorModel>(
  'special_gl_indicator',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    specialGlCode: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
  },
);

export default SpecialGlIndicator;
