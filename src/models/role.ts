import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import RoleModel from '../interfaces/masters/role.interface';

const Role = sequelize.define<RoleModel>('role', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    // unique: true,
    validate: {
      notNull: {
        msg: 'Name is required!',
      },
      len: {
        args: [2, 50],
        msg: 'Name must be under 2-50 characters.',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Description is required!',
      },
      len: {
        args: [2, 50],
        msg: 'Name must be under 3-50 characters.',
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

export default Role;
