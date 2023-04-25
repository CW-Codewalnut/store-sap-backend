import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import PasswordValidateTokenModel from '../interfaces/masters/passwordValidateToken.interface';

const PasswordValidateToken = sequelize.define<PasswordValidateTokenModel>(
  'password_validate_token',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING(16),
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isUsed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
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

export default PasswordValidateToken;
