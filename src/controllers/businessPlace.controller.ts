import { NextFunction, Request, Response } from 'express';
import BusinessPlace from '../models/business-place';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessPlaces = await BusinessPlace.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      businessPlaces,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll };
