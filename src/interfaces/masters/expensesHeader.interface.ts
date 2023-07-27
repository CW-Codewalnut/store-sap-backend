import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface ExpensesHeaderModel
  extends Model<
    InferAttributes<ExpensesHeaderModel>,
    InferCreationAttributes<ExpensesHeaderModel>
  > {
  id: string;
  documentStatus: string;
  postingDate: Date;
  sapDocNo: string;
  documentDate: Date;
  reference: string;
  period: string;
  documentHeaderText: string;
  plantId: string;
  reversalId: string;
  companyCode: string;
  currency: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExpensesHeaderWithDocumentLabel extends ExpensesHeaderModel {
  documentLabel: string;
}

export default ExpensesHeaderModel;
export { ExpensesHeaderWithDocumentLabel };
