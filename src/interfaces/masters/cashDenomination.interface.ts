import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface CashDenominationAttributes {
  id?: string;
  plantId: string;
  cashJournalId: string;
  denominationTotalAmount: number;
  qty1INR: number;
  qty2INR: number;
  qty5INR: number;
  qty10INR: number;
  qty20INR: number;
  qty50INR: number;
  qty100INR: number;
  qty200INR: number;
  qty500INR: number;
  qty2000INR: number;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CashDenominationModel
  extends Model<
      InferAttributes<CashDenominationModel>,
      InferCreationAttributes<CashDenominationModel>
    >,
    CashDenominationAttributes {}

export default CashDenominationModel;
