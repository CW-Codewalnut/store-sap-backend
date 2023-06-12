import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SalesDebitTransactionModel
  extends Model<
    InferAttributes<SalesDebitTransactionModel>,
    InferCreationAttributes<SalesDebitTransactionModel>
  > {
  id: string;
  salesHeaderId: string;
  businessTransactionId: string;
  glAccountId: string;
  description: string;
  postingKeyId: string;
  amount: number;
  profitCentreId: string;
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default SalesDebitTransactionModel;
