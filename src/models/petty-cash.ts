import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';

interface PettyCashModel
  extends Model<
    InferAttributes<PettyCashModel>,
    InferCreationAttributes<PettyCashModel>
  > {
  id: string;
  pettyCashType: 'Payment' | 'Receipt';
  documentStatus: 'Save' | 'Update' | 'Post';
  businessTransactionId: string;
  taxCodeId: string;
  glAccountId: string;
  amount: number;
  netAmount: number;
  taxRate: number;
  taxBaseAmount: number;
  bankAccountId: string;
  vendorId: string;
  customerId: string;
  receiptRecipient: string;
  postingDate: Date;
  documentDate: Date;
  plantId: string;
  costCentreId: string;
  profitCentreId: string;
  segmentId: string;
  cjDocNo: string;
  refDocNo: string;
  orderNo: string;
  employeeId: string;
  profitabilitySegmentNo: string;
  controllingArea: string;
  assets: string;
  subNumber: string;
  referenceDate: Date;
  transactionType: string;
  assignment: string;
  text: string;
  additionalText1: string;
  additionalText2: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PettyCash = sequelize.define<PettyCashModel>('petty_cash', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  pettyCashType: {
    allowNull: false,
    type: DataTypes.ENUM('Payment', 'Receipt'),
  },
  documentStatus: {
    allowNull: false,
    type: DataTypes.ENUM('Save', 'Update', 'Post'),
    defaultValue: 'Save',
  },
  businessTransactionId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: 'business_transactions',
      key: 'id',
    },
  },
  taxCodeId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: 'tax_codes',
      key: 'id',
    },
  },
  glAccountId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: 'gl_accounts',
      key: 'id',
    },
  },
  amount: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  netAmount: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  taxRate: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  taxBaseAmount: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  bankAccountId: {
    type: DataTypes.STRING(16),
    allowNull: true,
    references: {
      model: 'bank_accounts',
      key: 'id',
    },
  },
  vendorId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    references: {
      model: 'vendors',
      key: 'id',
    },
  },
  customerId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    references: {
      model: 'customers',
      key: 'id',
    },
  },
  receiptRecipient: {
    allowNull: true,
    type: DataTypes.STRING(35),
  },
  postingDate: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  documentDate: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  plantId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    references: {
      model: 'plants',
      key: 'id',
    },
  },
  costCentreId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    references: {
      model: 'cost_centres',
      key: 'id',
    },
  },
  profitCentreId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    references: {
      model: 'profit_centres',
      key: 'id',
    },
  },
  segmentId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    references: {
      model: 'segments',
      key: 'id',
    },
  },
  cjDocNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
  },
  refDocNo: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  orderNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
  },
  employeeId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  profitabilitySegmentNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
  },
  controllingArea: {
    allowNull: true,
    type: DataTypes.STRING(10),
  },
  assets: {
    allowNull: true,
    type: DataTypes.STRING(30),
  },
  subNumber: {
    allowNull: true,
    type: DataTypes.STRING(10),
  },
  referenceDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  transactionType: {
    allowNull: true,
    type: DataTypes.STRING(3),
  },
  assignment: {
    allowNull: true,
    type: DataTypes.STRING(18),
  },
  text: {
    allowNull: true,
    type: DataTypes.STRING(25),
  },
  additionalText1: {
    allowNull: true,
    type: DataTypes.STRING(100),
  },
  additionalText2: {
    allowNull: true,
    type: DataTypes.STRING(30),
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

export default PettyCash;
