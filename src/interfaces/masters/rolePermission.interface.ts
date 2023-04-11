import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface RolePermissionModel
  extends Model<
    InferAttributes<RolePermissionModel>,
    InferCreationAttributes<RolePermissionModel>
  > {
  id: string;
  roleId: string;
  permissionId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default RolePermissionModel;
