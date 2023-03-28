import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PlantModel
  extends Model<
    InferAttributes<PlantModel>,
    InferCreationAttributes<PlantModel>
  > {
  id: string;
  plantCode: number;
  plant: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default PlantModel;
