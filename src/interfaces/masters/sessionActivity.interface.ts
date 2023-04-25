import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SessionActivityModel
  extends Model<
    InferAttributes<SessionActivityModel>,
    InferCreationAttributes<SessionActivityModel>
  > {
  id?: string;
  sessionId: string;
  userId: string;
  loginTime?: Date;
  logoutTime?: Date;
  isExpired: boolean;
  device: string;
  ip: string;
  lat: string;
  long: string;
  updatedAt?: Date;
}

export default SessionActivityModel;
