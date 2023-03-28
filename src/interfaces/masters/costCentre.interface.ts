import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CostCentreModel
  extends Model<
    InferAttributes<CostCentreModel>,
    InferCreationAttributes<CostCentreModel>
  > {
  id: string;
  costCentre: number;
  sapDescription: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default CostCentreModel;
