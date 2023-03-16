import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {nanoid} from 'nanoid';
import {sequelize} from '.';
import User from './user';

interface SessionActivityModel
  extends Model<
    InferAttributes<SessionActivityModel>,
    InferCreationAttributes<SessionActivityModel>
  > {
  id: string;
  userId: number;
  loginTime: Date;
  logoutTime: Date;
  isExpired: boolean;
  device: string;
  ip: string;
  lat: string;
  long: string;
  updatedAt: Date;
}

const SessionActivity = sequelize.define<SessionActivityModel>(
  'session_activity',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    loginTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When a row is created, the login time is logged',
    },
    logoutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isExpired: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    device: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    createdAt: 'loginTime',
  },
);

SessionActivity.belongsTo(User, {
  foreignKey: 'userId',
});

export default SessionActivity;
