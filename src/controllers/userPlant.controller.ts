import { NextFunction, Request, Response } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import UserPlant from '../models/user-plant';
import MESSAGE from '../config/message.json';

const updateUserActivePlant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId } = req.params;

    const userId = req.user.id;
    const userPlant = await UserPlant.findOne({
      where: {
        userId,
        plantId,
      },
      raw: true,
    });

    if (userPlant) {
      req.session.activePlantId = plantId;
      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.SUCCESS,
        null,
      );
      return res.status(CODE[200]).send(response);
    }
    const response = responseFormatter(
      CODE[400],
      SUCCESS.FALSE,
      MESSAGE.BAD_REQUEST,
      null,
    );
    return res.status(CODE[400]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { updateUserActivePlant };
