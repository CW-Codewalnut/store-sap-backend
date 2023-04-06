import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface VendorModel
  extends Model<
    InferAttributes<VendorModel>,
    InferCreationAttributes<VendorModel>
  > {
  id: string;
  title: string;
  vendorNo: number;
  name1: string;
  name2: string;
  searchTerm1: string;
  searchTerm2: string;
  street1: string;
  street2: string;
  street3: string;
  pincode: string;
  phone: string;
  mobileNo: string;
  email: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default VendorModel;
