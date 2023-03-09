import { Request, Response } from 'express';
import CostCentre from '../models/cost-centre';
import { responseFormatter, CODE, STATUS } from '../config/response';

const getCostCentreByPlantId = async (req: Request, res: Response) => {
  try {
    const { plantId } = req.params;
    const costCentres = await CostCentre.findAll({
      where: { plantId },
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      costCentres,
    );
    res.status(200).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};

export default { getCostCentreByPlantId };
