import {Request, Response} from 'express';
import UserPlant from '../models/user-plant';
import Plant from '../models/plant';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getPlantsByUserId = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params;
    const plants = await UserPlant.findAll({
      include: [
        {
          model: Plant,
        },
      ],
      where: {userId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      plants,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getPlantsByUserId};
