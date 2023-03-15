import {nanoid} from 'nanoid';
import {DataTypes} from 'sequelize';
import {sequelize} from '.';
import Plant from './plant';

const Employee = sequelize.define('employee', {
  id: {
    type: DataTypes.STRING(16),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => nanoid(16),
  },
  employeeCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  employeeName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  plantId: {
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

Employee.belongsTo(Plant, {
  foreignKey: 'plantId',
});

export default Employee;
