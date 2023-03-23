import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

interface UserPlantModel
  extends Model<
    InferAttributes<UserPlantModel>,
    InferCreationAttributes<UserPlantModel>
  > {
  id: string;
  userId: string;
  plantId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default UserPlantModel