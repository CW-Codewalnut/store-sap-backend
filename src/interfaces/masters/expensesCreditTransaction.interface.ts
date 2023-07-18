import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

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
  assignment: string;
  text: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default ExpensesCreditTransactionModel;
