import { NextFunction, Request, Response } from 'express';
import PaymentTerm from '../models/payment-term';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentTerms = await PaymentTerm.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      paymentTerms,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll };
