import { NextFunction, Request, Response } from 'express';
import BankAccount from '../models/bank-account';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import UserPlant from '../models/user-plant';
import { MESSAGE } from '../utils/constant';

const updateUserActivePlant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId } = req.params;
    if(!plantId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const userId = req.user.id
    const userPlant = await UserPlant.findOne({
      where: { 
        userId: userId,
        plantId: plantId
       },
    });

    if(userPlant) {
      req.session.activePlantId = plantId;
      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        'Success',
        null,
      );
      return res.status(CODE[200]).send(response);
    } else {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    
  } catch (err: any) {
    next(err);
  }
};

export default { updateUserActivePlant };
