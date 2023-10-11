import { NextFunction, Request, Response } from 'express';
import SpecialGlIndicator from '../models/special-gl-indicator';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const specialGlIndicator = await SpecialGlIndicator.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      specialGlIndicator,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll };
