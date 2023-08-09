import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import VendorModel from './vendor.interface';
import PostingKeyModel from './postingKey.interface';
import SpecialGlIndicatorModel from './specialGlIndicator.interface';
import TaxCodeModel from './taxCode.interface';
import BusinessPlaceModel from './businessPlace.interface';
import SectionCodeModel from './sectionCode.interface';
import WithholdingTaxModel from './withholdingTax.interface';
import PaymentTermModel from './paymentTerm.interface';

interface ExpensesCreditTransactionModel
  extends Model<
    InferAttributes<ExpensesCreditTransactionModel>,
    InferCreationAttributes<ExpensesCreditTransactionModel>
  > {
  id: string;
  expensesHeaderId: string;
  vendorId: string;
  description: string;
  postingKeyId: string;
  specialGlIndicatorId: string;
  amount: number;
  taxCodeId: string;
  businessPlaceId: string;
  sectionCodeId: string;
  withholdingTaxId: string;
  paymentTermId: string;
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExpensesCreditTransactionModelWithIncludes
  extends ExpensesCreditTransactionModel {
  vendor?: VendorModel;
  posting_key?: PostingKeyModel;
  special_gl_indicator?: SpecialGlIndicatorModel;
  tax_code?: TaxCodeModel;
  business_place?: BusinessPlaceModel;
  section_code?: SectionCodeModel;
  withholding_tax?: WithholdingTaxModel;
  payment_term?: PaymentTermModel;
}

export default ExpensesCreditTransactionModel;
export { ExpensesCreditTransactionModelWithIncludes };
