import {nanoid} from 'nanoid';
import {DataTypes} from 'sequelize';
import {sequelize} from '.';
import Module from './module';

const BusinessTransaction = sequelize.define('business_transaction', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  moduleId: {
    type: DataTypes.STRING(16),
    allowNull: false,
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

BusinessTransaction.belongsTo(Module, {
  foreignKey: 'moduleId',
});

export default BusinessTransaction;
