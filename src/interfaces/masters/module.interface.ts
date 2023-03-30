import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface ModuleModel
  extends Model<
    InferAttributes<ModuleModel>,
    InferCreationAttributes<ModuleModel>
  > {
  id: string;
  name: string;
  slug: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default ModuleModel;
