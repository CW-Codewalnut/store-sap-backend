import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: string;
  employeeCode: string;
  email: string;
  password: string;
  roleId: number;
  accountStatus: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export default UserModel;
