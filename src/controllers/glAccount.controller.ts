import { NextFunction, Request, Response } from 'express';
import GlAccount from '../models/gl-account';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const getGlAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessTransactionId, glOf } = req.body;
    let query = {};

    if (businessTransactionId) {
      query = { businessTransactionId };
    } else if (glOf === 'vendor') {
      query = { venderGl: true };
    } else if (glOf === 'customer') {
      query = { customerGl: true };
    }

    const glAccounts = await GlAccount.findAll({
      where: query,
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      glAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getGlAccounts };
