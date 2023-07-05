import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import CustomerModel from './customer.interface';

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
  assignment: string;
  text: string;
  paymentMethod: string;
  cardType: string;
  cardSubType: string;
  posMidId: string;
  remitterName: string;
  RemitterContactNumber: string;
  UpiDetails: string;
  qrCode: string;
  rtgsOrNeftDetails: string;
  customerBankName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SalesCreditTransactionModelWithIncludes
  extends SalesCreditTransactionModel {
  customer?: CustomerModel;
}

export default SalesCreditTransactionModel;
export { SalesCreditTransactionModelWithIncludes };
