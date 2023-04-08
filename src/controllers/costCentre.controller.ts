import { NextFunction, Request, Response } from 'express';
import CostCentre from '../models/cost-centre';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const getCostCentreByPlantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId } = req.params;
    const costCentres = await CostCentre.findAll({
      where: { plantId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      costCentres,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getCostCentreByPlantId };
