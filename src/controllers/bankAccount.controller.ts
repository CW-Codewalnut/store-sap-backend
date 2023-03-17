import { NextFunction, Request, Response } from 'express';
import BankAccount from '../models/bank-account';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const getAccountsByHouseBankId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { houseBankId } = req.params;
    const bankAccounts = await BankAccount.findAll({
      where: { houseBankId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      bankAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getAccountsByHouseBankId };