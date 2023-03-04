import { nanoid } from 'nanoid';
// import sequelizeTransforms from 'sequelize-transforms';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '.';

interface UserAttributes {
  id: string;
  name: string;
  email: string | null;
  password: string | null;
  roleId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  // createdAt: Date;
  // updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

/* class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;

  public name!: string;

  public email!: string | null;

  public password!: string | null;

  public roleId!: string | null;

  public createdBy!: string | null;

  public updatedBy!: string | null;

  public deletedAt!: Date | null;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
} */

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
    // trim: true,
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
    // trim: true,
    unique: true,
    validate: {
      isEmail: {
        // args: true,
        msg: 'Invalid email address!',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
    // trim: true,
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

/* User.associate = (models: any) => {
    User.belongsTo(models.role, {
      foreignKey: 'roleId',
    });
  }; */

//   sequelizeTransforms(User);
export default User;
