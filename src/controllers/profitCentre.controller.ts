import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import ProfitCentre from '../models/profit-centre';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import CostCentre from '../models/cost-centre';

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
  } catch (err) {
    next(err);
  }
};

const getProfitCentreByPlantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId } = req.params;

    const costCentres = await CostCentre.findAll({
      attributes: ['id'],
      where: { plantId },
    });

    const costCentreIds = costCentres.map((costCentre) => costCentre.id);

    const profitCentres = await ProfitCentre.findAll({
      where: {
        costCentreId: {
          [Op.in]: costCentreIds,
        },
      },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      profitCentres,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getProfitCentreByCostCentreId, getProfitCentreByPlantId };
