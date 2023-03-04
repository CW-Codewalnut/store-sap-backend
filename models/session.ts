/* module.exports = (sequelize, Sequelize) => {
  const segment = sequelize.define('Session', {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    userId: Sequelize.STRING,
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
  });
  return segment;
}; */

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '.';

interface SessionModel
  extends Model<
    InferAttributes<SessionModel>,
    InferCreationAttributes<SessionModel>
  > {
  sid: string;
  userId: CreationOptional<string>;
  expires: CreationOptional<string>;
  data: CreationOptional<string>;
}
const Session = sequelize.define<SessionModel>(
  'Session',
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'Sessions',
  },
);

export { Session };
