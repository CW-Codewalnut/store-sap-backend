import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface BusinessPlaceModel
  extends Model<
    InferAttributes<BusinessPlaceModel>,
    InferCreationAttributes<BusinessPlaceModel>
  > {
  id: string;
  businessPlaceCode: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default BusinessPlaceModel;
