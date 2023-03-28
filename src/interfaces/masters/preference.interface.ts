import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PreferenceModel
  extends Model<
    InferAttributes<PreferenceModel>,
    InferCreationAttributes<PreferenceModel>
  > {
  id: string;
  name: string;
  value: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default PreferenceModel;
