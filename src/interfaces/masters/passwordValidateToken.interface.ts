import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PasswordValidateTokenModel
  extends Model<
    InferAttributes<PasswordValidateTokenModel>,
    InferCreationAttributes<PasswordValidateTokenModel>
  > {
  id: string;
  userId: string;
  token: string;
  isUsed: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default PasswordValidateTokenModel;
