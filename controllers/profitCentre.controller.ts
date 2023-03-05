import { Request, Response } from 'express';
import ProfitCentre from '../models/profit-centre';
import { format, CODE, STATUS } from '../config/response';

const getProfitCentreByCostCentreId = async (req: Request, res: Response) => {
  try {
    const { costCentreId } = req.params;
    const profitCentres = await ProfitCentre.findAll({
      where: { costCentreId },
    });
    const response = format(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      profitCentres,
    );
    res.status(200).send(response);
  } catch (err: any) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

export default { getProfitCentreByCostCentreId };
