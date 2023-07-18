import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

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

export default ExpensesDebitTransactionModel;
