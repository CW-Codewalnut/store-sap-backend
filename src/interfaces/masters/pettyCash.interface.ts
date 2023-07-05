import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import BusinessTransactionModel from './businessTransaction.interface';
import GlAccountModel from './glAccount.interface';
import HouseBankModel from './houseBank.interface';
import BankAccountModel from './bankAccount.interface';
import VendorModel from './vendor.interface';
import CustomerModel from './customer.interface';
import CostCentreModel from './costCentre.interface';
import ProfitCentreModel from './profitCentre.interface';
import SegmentModel from './segment.interface';
import TaxCodeModel from './taxCode.interface';

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
  cashJournalId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DatesType {
  postingDate: string;
  documentDate: string;
  referenceDate: string;
}

interface PettyCashModelWithIncludes extends PettyCashModel {
  business_transaction?: BusinessTransactionModel;
  gl_account?: GlAccountModel;
  house_bank?: HouseBankModel;
  bank_account?: BankAccountModel;
  vendor?: VendorModel;
  customer?: CustomerModel;
  tax_code?: TaxCodeModel;
  cost_centre?: CostCentreModel;
  profit_centre?: ProfitCentreModel;
  segment?: SegmentModel;
}

export default PettyCashModel;
export { DatesType, PettyCashModelWithIncludes };
