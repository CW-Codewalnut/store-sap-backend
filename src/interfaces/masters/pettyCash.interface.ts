import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PettyCashModel
  extends Model<
    InferAttributes<PettyCashModel>,
    InferCreationAttributes<PettyCashModel>
  > {
  id: string;
  pettyCashType: 'Payment' | 'Receipt';
  documentStatus:
    | 'Saved'
    | 'Updated'
    | 'Posted'
    | 'Updated Reversed'
    | 'Posted Reversed';
  businessTransactionId: string;
  taxCodeId: string;
  glAccountId: string;
  amount: number;
  netAmount: number;
  taxRate: number;
  taxBaseAmount: number;
  bankAccountId: string;
  vendorId: string;
  customerId: string;
  receiptRecipient: string;
  postingDate: Date;
  documentDate: Date;
  plantId: string;
  costCentreId: string;
  profitCentreId: string;
  segmentId: string;
  cjDocNo: string;
  refDocNo: string;
  orderNo: string;
  employeeId: string;
  profitabilitySegmentNo: string;
  controllingArea: string;
  assets: string;
  subNumber: string;
  referenceDate: Date;
  transactionType: string;
  assignment: string;
  text: string;
  additionalText1: string;
  additionalText2: string;
  reverseTransactionId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default PettyCashModel;
