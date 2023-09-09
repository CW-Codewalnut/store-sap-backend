import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SectionCodeModel
  extends Model<
    InferAttributes<SectionCodeModel>,
    InferCreationAttributes<SectionCodeModel>
  > {
  id: string;
  sectionCode: string;
  name: string;
  businessPlaceId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default SectionCodeModel;
