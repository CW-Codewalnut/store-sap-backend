import { DataTypes } from 'sequelize';
import { sequelize } from '.';
import SessionModel from '../interfaces/masters/session.interface';

const Session = sequelize.define<SessionModel>('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activePlantId: {
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
});

export default Session;
