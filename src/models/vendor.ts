import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';

interface VendorModel
  extends Model<
    InferAttributes<VendorModel>,
    InferCreationAttributes<VendorModel>
  > {
  id: string;
  title: string;
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
  gstNo: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const Vendor = sequelize.define<VendorModel>('vendor', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  title: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  name1: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name2: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  searchTerm1: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  searchTerm2: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  street1: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  street2: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  street3: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  mobileNo: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gstNo: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  createdBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  updatedBy: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
});

export default Vendor;
