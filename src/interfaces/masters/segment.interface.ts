import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface SegmentModel
  extends Model<
    InferAttributes<SegmentModel>,
    InferCreationAttributes<SegmentModel>
  > {
  id: string;
  segment: string;
  profitCentreId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default SegmentModel;
