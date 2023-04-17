import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SessionModel
  extends Model<
    InferAttributes<SessionModel>,
    InferCreationAttributes<SessionModel>
  > {
  sid: string;
  userId: string;
  activePlantId: string;
  isAllowedNewTransaction: boolean;
  expires: string;
  data: string;
}

export default SessionModel;
