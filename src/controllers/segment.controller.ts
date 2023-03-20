import { NextFunction, Request, Response } from 'express';

import Segment from '../models/segment';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

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
      'Fetched',
      Segments,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getSegmentsByProfitCentreId };
