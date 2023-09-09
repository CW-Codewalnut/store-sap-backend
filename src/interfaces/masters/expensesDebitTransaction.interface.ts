import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import PostingKeyModel from './postingKey.interface';
import ProfitCentreModel from './profitCentre.interface';
import BusinessPlaceModel from './businessPlace.interface';
import TaxCodeModel from './taxCode.interface';
import SpecialGlIndicatorModel from './specialGlIndicator.interface';
import CostCentreModel from './costCentre.interface';
import GlAccountModel from './glAccount.interface';

interface ExpensesDebitTransactionModel
  extends Model<
    InferAttributes<ExpensesDebitTransactionModel>,
    InferCreationAttributes<ExpensesDebitTransactionModel>
  > {
  id: string;
  expensesHeaderId: string;
  businessTransactionId: string;
  glAccountId: string;
  description: string;
  postingKeyId: string;
  specialGlIndicatorId: string;
  amount: number;
  taxCodeId: string;
  businessPlaceId: string;
  costCentreId: string;
  profitCentreId: string;
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExpensesDebitTransactionModelWithIncludes
  extends ExpensesDebitTransactionModel {
  business_transaction?: BusinessPlaceModel;
  gl_account?: GlAccountModel;
  posting_key?: PostingKeyModel;
  special_gl_indicator?: SpecialGlIndicatorModel;
  tax_code?: TaxCodeModel;
  business_place?: BusinessPlaceModel;
  cost_centre?: CostCentreModel;
  profit_centre?: ProfitCentreModel;
}

export default ExpensesDebitTransactionModel;
export { ExpensesDebitTransactionModelWithIncludes };
