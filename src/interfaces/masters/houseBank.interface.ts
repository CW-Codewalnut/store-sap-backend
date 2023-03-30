import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface HouseBankModel
  extends Model<
    InferAttributes<HouseBankModel>,
    InferCreationAttributes<HouseBankModel>
  > {
  id: string;
  ifsc: string;
  bankName: string;
  street: string;
  city: string;
  bankBranch: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default HouseBankModel;
