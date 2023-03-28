import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface BusinessTransactionModel
  extends Model<
    InferAttributes<BusinessTransactionModel>,
    InferCreationAttributes<BusinessTransactionModel>
  > {
  id: string;
  businessTransactionNo: number;
  shortText: string;
  longText: string;
  moduleId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default BusinessTransactionModel;
