import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface PlantClosingDenominationAttributes {
  id?: string;
  plantId: string;
  cashJournalId: string;
  closingBalanceAmount: number;
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

interface PlantClosingDenominationModel
  extends Model<
    InferAttributes<PlantClosingDenominationModel>,
    InferCreationAttributes<PlantClosingDenominationModel>
  >, PlantClosingDenominationAttributes {}

export default PlantClosingDenominationModel;
