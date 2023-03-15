import { nanoid } from 'nanoid';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '.';
import Role from './role';

interface UserAttributes {
  id: string;
  name: string;
  email: string | null;
  password: string | null;
  roleId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>('user', {
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
  email: {
    type: DataTypes.STRING(100),
    defaultValue: null,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email address!',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
    validate: {
      len: {
        args: [32, 32],
        msg: 'Invalid password..try again.',
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
});

User.belongsTo(Role, {
  foreignKey: 'roleId',
});

export default User;
