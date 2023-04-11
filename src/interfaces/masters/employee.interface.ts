import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface EmployeeModel
  extends Model<
    InferAttributes<EmployeeModel>,
    InferCreationAttributes<EmployeeModel>
  > {
  id: string;
  employeeCode: string;
  employeeName: string;
  plantId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export default EmployeeModel;
