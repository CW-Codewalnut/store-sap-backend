import { NextFunction, Request, Response } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { getHouseBanks } from './common.controller';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const houseBanks = await getHouseBanks();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      houseBanks,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { findAll };
