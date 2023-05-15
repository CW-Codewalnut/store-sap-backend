import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface GlAccountModel
  extends Model<
    InferAttributes<GlAccountModel>,
    InferCreationAttributes<GlAccountModel>
  > {
  id: string;
  glAccounts: number;
  shortText: string;
  longText: string;
  businessTransactionId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default GlAccountModel;
