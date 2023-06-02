import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CustomerModel
  extends Model<
    InferAttributes<CustomerModel>,
    InferCreationAttributes<CustomerModel>
  > {
  id: string;
  title: string;
  customerNo: number;
  customerName1: string;
  customerName2: string;
  customerName3: string;
  houseDescription: string;
  street1: string;
  street2: string;
  district: string;
  city: string;
  pincode: string;
  state: string;
  telephone: string;
  mobile: string;
  email1: string;
  email2: string;
  contactPerson: string;
  gstNo: string;
  pan: string;
  paymentTermId: string;
  currentCreditLimit: string;
  customerType: string;
  glAccountId: string;
  updatedBy: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default CustomerModel;
