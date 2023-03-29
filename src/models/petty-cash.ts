import {
  DataTypes,
} from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import BusinessTransaction from './business-transaction';
import TaxCode from './tax-code';
import GlAccount from './gl-account';
import Vendor from './vendor';
import Customer from './customer';
import BankAccount from './bank-account';
import Plant from './plant';
import CostCentre from './cost-centre';
import ProfitCentre from './profit-centre';
import Segment from './segment';
import Employee from './employee';
import PettyCashModel from '../interfaces/masters/pettyCash.interface';

const PettyCash = sequelize.define<PettyCashModel>('petty_cash', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  pettyCashType: {
    allowNull: false,
    type: DataTypes.STRING(20),
    validate: { 
      isIn: {
        args: [['Payment', 'Receipt']],
        msg: "Cash journal type must be 'Payment' or 'Receipt'"
      }
    }
  },
  documentStatus: {
    allowNull: false,
    type: DataTypes.STRING(20),
    defaultValue: 'Saved',
    validate: {
      isIn: {
        args: [['Saved', 'Updated', 'Posted', 'Updated Reversed', 'Posted Reversed']],
        msg: "Document status must be 'Saved', 'Updated', 'Posted', 'Updated Reversed' or 'Posted Reversed'"
      }
    }
  },
  businessTransactionId: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  taxCodeId: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  glAccountId: {
    type: DataTypes.STRING(16),
    allowNull: false,
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
  },
  vendorId: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  customerId: {
    allowNull: true,
    type: DataTypes.STRING(16),
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
  },
  costCentreId: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  profitCentreId: {
    allowNull: false,
    type: DataTypes.STRING(16),
  },
  segmentId: {
    allowNull: false,
    type: DataTypes.STRING(16),
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
  reverseTransactionId: {
    type: DataTypes.STRING(16),
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

PettyCash.belongsTo(BusinessTransaction, {
  foreignKey: 'businessTransactionId',
});
PettyCash.belongsTo(TaxCode, {
  foreignKey: 'taxCodeId',
});
PettyCash.belongsTo(GlAccount, {
  foreignKey: 'glAccountId',
});
PettyCash.belongsTo(BankAccount, {
  foreignKey: 'bankAccountId',
});
PettyCash.belongsTo(Vendor, {
  foreignKey: 'vendorId',
});
PettyCash.belongsTo(Customer, {
  foreignKey: 'customerId',
});
PettyCash.belongsTo(Plant, {
  foreignKey: 'plantId',
});
PettyCash.belongsTo(CostCentre, {
  foreignKey: 'costCentreId',
});
PettyCash.belongsTo(ProfitCentre, {
  foreignKey: 'profitCentreId',
});
PettyCash.belongsTo(Segment, {
  foreignKey: 'segmentId',
});
PettyCash.belongsTo(Employee, {
  foreignKey: 'employeeId',
});

export default PettyCash;
