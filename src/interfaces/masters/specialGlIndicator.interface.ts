import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SpecialGlIndicatorModel
  extends Model<
    InferAttributes<SpecialGlIndicatorModel>,
    InferCreationAttributes<SpecialGlIndicatorModel>
  > {
  id: string;
  specialGlCode: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default SpecialGlIndicatorModel;
