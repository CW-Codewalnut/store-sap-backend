import { NextFunction, Request, Response } from 'express';

import Segment from '../models/segment';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const getSegmentsByProfitCentreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profitCentreId } = req.params;
    const Segments = await Segment.findAll({
      where: { profitCentreId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      Segments,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getSegmentsByProfitCentreId };
