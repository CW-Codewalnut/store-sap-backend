import { NextFunction, Request, Response } from 'express';
import Vendor from '../models/vendor';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await Vendor.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      vendors,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { findAll };
