import { DataTypes } from 'sequelize';
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
import MESSAGE from '../config/message.json';

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
      notNull: {
        msg: MESSAGE.PETTY_CASH_TYPE_REQUIRED,
      },
      isIn: {
        args: [['Payment', 'Receipt']],
        msg: MESSAGE.PETTY_CASH_TYPE_EXPECTED,
      },
    },
  },
  documentStatus: {
    allowNull: false,
    type: DataTypes.STRING(20),
    defaultValue: 'Saved',
    validate: {
      isIn: {
        args: [
          ['Saved', 'Updated', 'Posted', 'Updated Reversed', 'Posted Reversed'],
        ],
        msg: MESSAGE.DOCUMENT_STATUS_ALLOWED_VALUES,
      },
    },
  },
  businessTransactionId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      notNull: {
        msg: MESSAGE.BUSINESS_TRANSACTION_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.BUSINESS_TRANSACTION_INVALID,
      },
    },
  },
  taxCodeId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      notNull: {
        msg: MESSAGE.TAX_CODE_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.TAX_CODE_INVALID,
      },
    },
  },
  glAccountId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      notNull: {
        msg: MESSAGE.GL_ACCOUNT_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.GL_ACCOUNT_INVALID,
      },
    },
  },
  amount: {
    allowNull: false,
    type: DataTypes.BIGINT,
    validate: {
      notNull: {
        msg: MESSAGE.AMOUNT_REQUIRED,
      },
      customValidator() {
        if (
          this.amount !== this.netAmount ||
          this.amount !== this.taxBaseAmount
        ) {
          throw new Error(MESSAGE.AMOUNT_EQUALITY_CHECKS);
        }
      },
    },
  },
  netAmount: {
    allowNull: false,
    type: DataTypes.BIGINT,
    validate: {
      notNull: {
        msg: MESSAGE.NET_AMOUNT_REQUIRED,
      },
    },
  },
  taxRate: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  taxBaseAmount: {
    allowNull: false,
    type: DataTypes.BIGINT,
    validate: {
      notNull: {
        msg: MESSAGE.TAX_BASE_AMOUNT_REQUIRED,
      },
    },
  },
  bankAccountId: {
    type: DataTypes.STRING(16),
    allowNull: true,
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.BANK_ACCOUNT_INVALID,
      },
    },
  },
  vendorId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      customValidator() {
        if (this.vendorId) {
          if (this.customerId) {
            throw new Error(MESSAGE.EITHER_SUPPLIER_CUSTOMER);
          }
        }
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.VENDOR_INVALID,
      },
    },
  },
  customerId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.CUSTOMER_INVALID,
      },
    },
  },
  receiptRecipient: {
    allowNull: true,
    type: DataTypes.STRING(35),
    validate: {
      customValidator() {
        if (this.vendorId || this.customerId) {
          if (!this.receiptRecipient) {
            throw new Error(MESSAGE.RECEIPT_RECIPIENT_REQUIRED);
          }
        }
      },
      len: {
        args: [1, 35],
        msg: MESSAGE.RECEIPT_RECIPIENT_LENGTH,
      },
    },
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
    validate: {
      notNull: {
        msg: MESSAGE.PLANT_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.PLANT_INVALID,
      },
    },
  },
  costCentreId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.COST_CENTRE_INVALID,
      },
    },
  },
  profitCentreId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    validate: {
      notNull: {
        msg: MESSAGE.PROFIT_CENTRE_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.PROFIT_CENTRE_INVALID,
      },
    },
  },
  segmentId: {
    allowNull: false,
    type: DataTypes.STRING(16),
    validate: {
      notNull: {
        msg: MESSAGE.SEGMENT_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.SEGMENT_INVALID,
      },
    },
  },
  cjDocNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
    validate: {
      len: {
        args: [1, 10],
        msg: MESSAGE.CJ_DOC_NO_LENGTH,
      },
    },
  },
  refDocNo: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      len: {
        args: [1, 16],
        msg: MESSAGE.REFERENCE_DOC_NO_LENGTH,
      },
    },
  },
  orderNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
    validate: {
      len: {
        args: [1, 10],
        msg: MESSAGE.ORDER_NO_LENGTH,
      },
    },
  },
  employeeId: {
    allowNull: true,
    type: DataTypes.STRING(16),
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.EMPLOYEE_INVALID,
      },
    },
  },
  profitabilitySegmentNo: {
    allowNull: true,
    type: DataTypes.STRING(10),
    validate: {
      len: {
        args: [1, 10],
        msg: MESSAGE.PROFITABILITY_SEGMENT_NO_LENGTH,
      },
    },
  },
  controllingArea: {
    allowNull: false,
    type: DataTypes.STRING(10),
    validate: {
      customValidator(value: string) {
        if (value !== '1000') {
          throw new Error(MESSAGE.CONTROLLING_AREA_VALUE);
        }
      },
    },
  },
  assets: {
    allowNull: true,
    type: DataTypes.STRING(30),
    validate: {
      len: {
        args: [1, 30],
        msg: MESSAGE.ASSETS_LENGTH,
      },
    },
  },
  subNumber: {
    allowNull: true,
    type: DataTypes.STRING(10),
    validate: {
      len: {
        args: [1, 10],
        msg: MESSAGE.SUB_NUMBER_LENGTH,
      },
    },
  },
  referenceDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  transactionType: {
    allowNull: true,
    type: DataTypes.STRING(3),
    validate: {
      len: {
        args: [1, 13],
        msg: MESSAGE.TRANSACTION_TYPE_LENGTH,
      },
    },
  },
  assignment: {
    allowNull: true,
    type: DataTypes.STRING(18),
    validate: {
      len: {
        args: [1, 18],
        msg: MESSAGE.ASSIGNMENT_LENGTH,
      },
    },
  },
  text: {
    allowNull: true,
    type: DataTypes.STRING(25),
    validate: {
      len: {
        args: [1, 25],
        msg: MESSAGE.TEXT_LENGTH,
      },
    },
  },
  additionalText1: {
    allowNull: true,
    type: DataTypes.STRING(100),
    validate: {
      len: {
        args: [1, 100],
        msg: MESSAGE.ADDITIONAL_TEXT_1_LENGTH,
      },
    },
  },
  additionalText2: {
    allowNull: true,
    type: DataTypes.STRING(30),
    validate: {
      len: {
        args: [1, 30],
        msg: MESSAGE.ADDITIONAL_TEXT_2_LENGTH,
      },
    },
  },
  reverseTransactionId: {
    type: DataTypes.STRING(16),
    allowNull: true,
    validate: {
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.REVERSE_TRANSACTION_INVALID,
      },
    },
  },
  cashJournalId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      notNull: {
        msg: MESSAGE.CASH_JOURNAL_REQUIRED,
      },
      is: {
        args: /^[A-Za-z0-9_-]{16}$/,
        msg: MESSAGE.CASH_JOURNAL_INVALID,
      },
    },
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
