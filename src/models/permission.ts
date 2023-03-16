import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';

interface PermissionModel
  extends Model<
    InferAttributes<PermissionModel>,
    InferCreationAttributes<PermissionModel>
  > {
  id: string;
  name: string;
  description: string;
  slug: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

const Permission = sequelize.define<PermissionModel>('permission', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name is required!',
      },
      len: {
        args: [3, 50],
        msg: 'Name must be under 3-50 characters.',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING(16),
    allowNull: false,
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

export default Permission;
