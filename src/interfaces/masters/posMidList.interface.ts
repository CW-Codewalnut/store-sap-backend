import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PosMidListModel
  extends Model<
    InferAttributes<PosMidListModel>,
    InferCreationAttributes<PosMidListModel>
  > {
  id: string;
  meCode: string;
  tid: string;
  legalName: string;
  dbaName: string;
  address: string;
  city: string;
  pin: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default PosMidListModel;
