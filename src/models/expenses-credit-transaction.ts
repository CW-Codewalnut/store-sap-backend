import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ExpensesCreditTransactionModel from '../interfaces/masters/expensesCreditTransaction.interface';

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
      salesHeaderId: {
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
        type: DataTypes.DECIMAL(13, 2),
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
      assignment: {
        allowNull: true,
        type: DataTypes.STRING(18),
      },
      text: {
        allowNull: true,
        type: DataTypes.STRING(25),
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

export default ExpensesCreditTransaction;
