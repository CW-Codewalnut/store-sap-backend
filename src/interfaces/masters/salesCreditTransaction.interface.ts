import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SalesCreditTransactionModel
  extends Model<
    InferAttributes<SalesCreditTransactionModel>,
    InferCreationAttributes<SalesCreditTransactionModel>
  > {
  id: string;
  salesHeaderId: string;
  customerId: string;
  description: string;
  postingKeyId: string;
  amount: number;
  baselineDate: Date;
  paymentMethod: string;
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default SalesCreditTransactionModel;
