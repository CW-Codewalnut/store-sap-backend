import { NextFunction, Request, Response } from 'express';
import TaxCode from '../models/tax-code';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taxCodes = await TaxCode.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      taxCodes,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { findAll };
