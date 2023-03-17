import { NextFunction, Request, Response } from 'express';
import GlAccount from '../models/gl-account';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const getGlAccountsByBusinessTransactionId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessTransactionId } = req.params;
    const glAccounts = await GlAccount.findAll({
      where: { businessTransactionId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      glAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getGlAccountsByBusinessTransactionId };
