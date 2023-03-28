import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface TaxCodeModel
  extends Model<
    InferAttributes<TaxCodeModel>,
    InferCreationAttributes<TaxCodeModel>
  > {
  id: string;
  taxCode: string;
  description: string;
  taxRate: string;
  groupName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default TaxCodeModel;
