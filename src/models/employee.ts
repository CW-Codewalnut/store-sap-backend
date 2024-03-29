import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '.';
import Plant from './plant';
import EmployeeModel from '../interfaces/masters/employee.interface';

const Employee = sequelize.define<EmployeeModel>('employee', {
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
