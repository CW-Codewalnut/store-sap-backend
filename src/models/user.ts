import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Role from './role';
import UserModel from '../interfaces/masters/user.interface';
import Employee from './employee';
import MESSAGE from '../config/message.json';

const User = sequelize.define<UserModel>('user', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  employeeCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: {
        msg: MESSAGE.EMAIL_INVALID,
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: {
        args: [32, 32],
        msg: MESSAGE.PASSWORD_LENGTH,
      },
    },
  },
  roleId: {
    type: DataTypes.STRING(16),
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
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
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

User.belongsTo(Role, {
  foreignKey: 'roleId',
});

User.belongsTo(Employee, {
  foreignKey: 'employeeCode',
  targetKey: 'employeeCode',
});

export default User;
