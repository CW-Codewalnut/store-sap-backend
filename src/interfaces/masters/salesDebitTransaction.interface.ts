import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import PostingKeyModel from './postingKey.interface';
import ProfitCentreModel from './profitCentre.interface';

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
  documentTypeId: string;
  profitCentreId: string;
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SalesDebitTransactionModelWithIncludes
  extends SalesDebitTransactionModel {
  posting_key?: PostingKeyModel;
  profit_centre?: ProfitCentreModel;
}

export default SalesDebitTransactionModel;
export { SalesDebitTransactionModelWithIncludes };
