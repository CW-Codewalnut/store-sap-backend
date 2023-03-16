import { Request, Response } from 'express';
import HouseBank from '../models/house-bank';
import { responseFormatter, CODE, STATUS } from '../config/response';

const findAll = async (req: Request, res: Response) => {
  try {
    const houseBanks = await HouseBank.findAll();
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      houseBanks,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default { findAll };
