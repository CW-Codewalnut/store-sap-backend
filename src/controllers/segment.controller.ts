import { Request, Response } from 'express';

import Segment from '../models/segment';
import { format, CODE, STATUS } from '../config/response';

const getSegmentsByProfitCentreId = async (req: Request, res: Response) => {
  try {
    const { profitCentreId } = req.params;
    const Segments = await Segment.findAll({
      where: { profitCentreId },
    });
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', Segments);
    res.status(200).send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

export default { getSegmentsByProfitCentreId };
