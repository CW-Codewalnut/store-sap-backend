import { NextFunction, Request, Response } from 'express';
import UserPlant from '../models/user-plant';
import Plant from '../models/plant';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

const getPlantsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const plants = await UserPlant.findAll({
      include: [
        {
          model: Plant,
        },
      ],
      where: { userId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      plants,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getPlantsByUserId };
