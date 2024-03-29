import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import ExpensesHeaderModel from '../interfaces/masters/expensesHeader.interface';
import Plant from './plant';
import DocumentType from './document-type';

const ExpensesHeader = sequelize.define<ExpensesHeaderModel>(
  'expenses_header',
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(16),
    },
    documentStatus: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'Saved',
    },
    postingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sapDocNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    documentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentTypeId: {
      allowNull: false,
      type: DataTypes.STRING(16),
    },
    documentHeaderText: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    plantId: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    reversalId: {
      allowNull: true,
      type: DataTypes.STRING(16),
    },
    companyCode: {
      allowNull: false,
      type: DataTypes.STRING(4),
      defaultValue: '1000',
    },
    currency: {
      allowNull: false,
      type: DataTypes.STRING(8),
      defaultValue: 'INR',
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

ExpensesHeader.belongsTo(Plant, {
  foreignKey: 'plantId',
});
ExpensesHeader.belongsTo(DocumentType, {
  foreignKey: 'documentTypeId',
});

export default ExpensesHeader;
