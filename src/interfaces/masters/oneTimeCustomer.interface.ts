import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CustomerModel
  extends Model<
    InferAttributes<CustomerModel>,
    InferCreationAttributes<CustomerModel>
  > {
  id: string;
  salesHeaderId: string;
  title: string;
  languageKey: string;
  name: string;
  street: string;
  city: string;
  PostalCode: string;
  state: string;
  country: string;
  gstNumber: string;
  mobile: string;
  email: string;
  bankKey: string;
  bankAccountNumber: string;
  bankCountry: string;
  reference: string;
  updatedBy: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default CustomerModel;
