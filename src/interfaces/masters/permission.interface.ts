import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PermissionModel
  extends Model<
    InferAttributes<PermissionModel>,
    InferCreationAttributes<PermissionModel>
  > {
  id: string;
  name: string;
  description: string;
  slug: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default PermissionModel;
