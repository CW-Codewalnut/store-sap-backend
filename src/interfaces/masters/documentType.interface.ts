import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface DocumentTypeModel
  extends Model<
    InferAttributes<DocumentTypeModel>,
    InferCreationAttributes<DocumentTypeModel>
  > {
  id: string;
  documentType: string;
  description: string;
  businessTransactionId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default DocumentTypeModel;
