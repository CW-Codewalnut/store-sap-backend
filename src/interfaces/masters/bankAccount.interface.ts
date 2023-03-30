import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface BankAccountModel
  extends Model<
    InferAttributes<BankAccountModel>,
    InferCreationAttributes<BankAccountModel>
  > {
  id: string;
  bankAccountNumber: string;
  AccountType: string;
  houseBankId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default BankAccountModel;
