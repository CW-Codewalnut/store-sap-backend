import { NextFunction, Request, Response } from 'express';
import HouseBank from '../models/house-bank';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { getHouseBanks } from './common.controller';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const houseBanks = await getHouseBanks();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      houseBanks,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { findAll };
