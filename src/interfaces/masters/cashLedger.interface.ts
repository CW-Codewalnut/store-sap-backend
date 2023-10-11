import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CashLedgerModel
  extends Model<
    InferAttributes<CashLedgerModel>,
    InferCreationAttributes<CashLedgerModel>
  > {
  id: string;
  cashLedgerNo: number;
  name: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default CashLedgerModel;
