import {Request, Response} from 'express';
import ProfitCentre from '../models/profit-centre';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getProfitCentreByCostCentreId = async (req: Request, res: Response) => {
  try {
    const {costCentreId} = req.params;
    const profitCentres = await ProfitCentre.findAll({
      where: {costCentreId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      profitCentres,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getProfitCentreByCostCentreId};
