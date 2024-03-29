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
    const { businessTransactionId } = req.body;

    const glAccounts = await GlAccount.findAll({
      where: { businessTransactionId },
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      glAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getGlAccounts };
