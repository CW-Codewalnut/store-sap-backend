import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ExpensesCreditTransactionModel from '../interfaces/masters/expensesCreditTransaction.interface';
import PostingKey from './posting-key';
import SpecialGlIndicator from './special-gl-indicator';
import BusinessPlace from './business-place';
import TaxCode from './tax-code';
import SectionCode from './section-code';
import WithholdingTax from './withholding-tax';
import Vendor from './vendor';
import PaymentTerm from './payment-term';

const ExpensesCreditTransaction =
  sequelize.define<ExpensesCreditTransactionModel>(
    'expenses_credit_transaction',
    {
      id: {
        type: DataTypes.STRING(16),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid(16),
      },
      expensesHeaderId: {
        allowNull: false,
        type: DataTypes.STRING(16),
      },
      vendorId: {
        allowNull: true,
        type: DataTypes.STRING(16),
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postingKeyId: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      specialGlIndicatorId: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(23, 2),
      },
      taxCodeId: {
        allowNull: true,
        type: DataTypes.STRING(16),
      },
      businessPlaceId: {
        allowNull: false,
        type: DataTypes.STRING(16),
      },
      sectionCodeId: {
        allowNull: false,
        type: DataTypes.STRING(16),
      },
      withholdingTaxId: {
        allowNull: true,
        type: DataTypes.STRING(16),
      },
      paymentTermId: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      assignment: {
        allowNull: true,
        type: DataTypes.STRING(18),
      },
      text: {
        allowNull: true,
        type: DataTypes.STRING(50),
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
    },
  );

ExpensesCreditTransaction.belongsTo(Vendor, {
  foreignKey: 'vendorId',
});
ExpensesCreditTransaction.belongsTo(PostingKey, {
  foreignKey: 'postingKeyId',
});
ExpensesCreditTransaction.belongsTo(SpecialGlIndicator, {
  foreignKey: 'specialGlIndicatorId',
});
ExpensesCreditTransaction.belongsTo(TaxCode, {
  foreignKey: 'taxCodeId',
});
ExpensesCreditTransaction.belongsTo(BusinessPlace, {
  foreignKey: 'businessPlaceId',
});
ExpensesCreditTransaction.belongsTo(SectionCode, {
  foreignKey: 'sectionCodeId',
});
ExpensesCreditTransaction.belongsTo(WithholdingTax, {
  foreignKey: 'withholdingTaxId',
});
ExpensesCreditTransaction.belongsTo(PaymentTerm, {
  foreignKey: 'paymentTermId',
});

export default ExpensesCreditTransaction;
