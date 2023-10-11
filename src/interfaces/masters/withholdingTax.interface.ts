import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface WithholdingTaxModel
  extends Model<
    InferAttributes<WithholdingTaxModel>,
    InferCreationAttributes<WithholdingTaxModel>
  > {
  id: string;
  taxCode: string;
  tdsSection: string;
  tdsRates: number;
  description: string;
  gl: string;
  withholdingType: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default WithholdingTaxModel;
