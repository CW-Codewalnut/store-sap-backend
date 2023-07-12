import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SalesHeaderModel
  extends Model<
    InferAttributes<SalesHeaderModel>,
    InferCreationAttributes<SalesHeaderModel>
  > {
  id: string;
  documentStatus:
    | 'Saved'
    | 'Updated'
    | 'Posted'
    | 'Updated Reversed'
    | 'Posted Reversed';
  postingDate: Date;
  sapDocNo: string;
  documentDate: Date;
  reference: string;
  period: string;
  documentHeaderText: string;
  plantId: string;
  cashLedgerId: string;
  reversalId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SalesHeaderWithDocumentLabel extends SalesHeaderModel {
  documentLabel: string;
}

export default SalesHeaderModel;
export { SalesHeaderWithDocumentLabel };
