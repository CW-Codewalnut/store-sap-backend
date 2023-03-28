import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface ProfitCentreModel
  extends Model<
    InferAttributes<ProfitCentreModel>,
    InferCreationAttributes<ProfitCentreModel>
  > {
  id: string;
  profitCentre: number;
  sapDescription: string;
  costCentreId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default ProfitCentreModel;
