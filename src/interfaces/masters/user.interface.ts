import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: string;
  employeeCode: string;
  email: string;
  password: string | any;
  roleId: number;
  accountStatus: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface DecodedTokenData {
  userId: string;
}

export default UserModel;
export { DecodedTokenData };
