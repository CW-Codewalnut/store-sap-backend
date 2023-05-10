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
  assignment: string;
  text: string;
  paymentMethod: string;
  cardType: string;
  cardSubType: string;
  terminalId: string;
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

export default SalesCreditTransactionModel;
