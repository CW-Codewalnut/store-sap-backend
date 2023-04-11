import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PaymentTermModel
  extends Model<
    InferAttributes<PaymentTermModel>,
    InferCreationAttributes<PaymentTermModel>
  > {
  id: string;
  payTerm: string;
  payTermDescription: string;
  netDueDate: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default PaymentTermModel;
