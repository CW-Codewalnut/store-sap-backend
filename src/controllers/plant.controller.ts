import { NextFunction, Request, Response } from 'express';
import UserPlant from '../models/user-plant';
import Plant from '../models/plant';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plants = await Plant.findAll({
      attributes: ['id', 'plant', 'plantCode'],
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      plants,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const getPlantsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const userPlants = await UserPlant.findAll({
      include: [
        {
          model: Plant,
          attributes: {
            exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt'],
          },
        },
      ],
      where: { userId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      userPlants,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll, getPlantsByUserId };
