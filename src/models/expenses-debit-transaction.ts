import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ExpensesDebitTransactionModel from '../interfaces/masters/expensesDebitTransaction.interface';
import BusinessTransaction from './business-transaction';
import GlAccount from './gl-account';
import PostingKey from './posting-key';
import ProfitCentre from './profit-centre';
import TaxCode from './tax-code';
import BusinessPlace from './business-place';
import CostCentre from './cost-centre';
import SpecialGlIndicator from './special-gl-indicator';

const ExpensesDebitTransaction =
  sequelize.define<ExpensesDebitTransactionModel>(
    'expenses_debit_transaction',
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
      businessTransactionId: {
        allowNull: false,
        type: DataTypes.STRING(16),
      },
      glAccountId: {
        type: DataTypes.STRING(16),
        allowNull: false,
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
      costCentreId: {
        allowNull: false,
        type: DataTypes.STRING(16),
      },
      profitCentreId: {
        allowNull: false,
        type: DataTypes.STRING(16),
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

ExpensesDebitTransaction.belongsTo(BusinessTransaction, {
  foreignKey: 'businessTransactionId',
});
ExpensesDebitTransaction.belongsTo(GlAccount, {
  foreignKey: 'glAccountId',
});
ExpensesDebitTransaction.belongsTo(PostingKey, {
  foreignKey: 'postingKeyId',
});
ExpensesDebitTransaction.belongsTo(SpecialGlIndicator, {
  foreignKey: 'specialGlIndicatorId',
});
ExpensesDebitTransaction.belongsTo(CostCentre, {
  foreignKey: 'costCentreId',
});
ExpensesDebitTransaction.belongsTo(ProfitCentre, {
  foreignKey: 'profitCentreId',
});
ExpensesDebitTransaction.belongsTo(TaxCode, {
  foreignKey: 'taxCodeId',
});
ExpensesDebitTransaction.belongsTo(BusinessPlace, {
  foreignKey: 'businessPlaceId',
});

export default ExpensesDebitTransaction;
