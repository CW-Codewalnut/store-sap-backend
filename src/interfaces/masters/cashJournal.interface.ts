import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CashJournalModel
  extends Model<
    InferAttributes<CashJournalModel>,
    InferCreationAttributes<CashJournalModel>
  > {
  id: string;
  cashJournalNo: number;
  name: string;
  currency: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default CashJournalModel;
