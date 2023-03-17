import { NextFunction, Request, Response } from 'express';
import BusinessTransaction from '../models/business-transaction';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const getBusinessTransactionsByModuleId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { moduleId } = req.params;
    const businessTransactions = await BusinessTransaction.findAll({
      where: { moduleId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      businessTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getBusinessTransactionsByModuleId };
