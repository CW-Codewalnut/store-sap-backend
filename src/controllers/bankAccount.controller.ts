import {Request, Response} from 'express';
import BankAccount from '../models/bank-account';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getAccountsByHouseBankId = async (req: Request, res: Response) => {
  try {
    const {houseBankId} = req.params;
    const bankAccounts = await BankAccount.findAll({
      where: {houseBankId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      bankAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getAccountsByHouseBankId};
