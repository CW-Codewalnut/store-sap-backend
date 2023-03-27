import { NextFunction, Request, Response } from 'express';
import ProfitCentre from '../models/profit-centre';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const getProfitCentreByCostCentreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { costCentreId } = req.params;
    const profitCentres = await ProfitCentre.findAll({
      where: { costCentreId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      profitCentres,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getProfitCentreByCostCentreId };
