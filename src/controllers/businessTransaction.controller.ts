import {Request, Response} from 'express';
import BusinessTransaction from '../models/business-transaction';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getBusinessTransactionsByModuleId = async (
  req: Request,
  res: Response,
) => {
  try {
    const {moduleId} = req.params;
    const businessTransactions = await BusinessTransaction.findAll({
      where: {moduleId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      businessTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getBusinessTransactionsByModuleId};
