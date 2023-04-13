import { NextFunction, Request, Response } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import PlantClosingDenomination from '../models/plant-closing-denomination';
import { PlantClosingDenominationAttributes } from '../interfaces/masters/plantClosingDenomination.interface';

const storeDenomination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId, 
            closingBalanceAmount, 
            qty1INR,
            qty2INR,
            qty5INR,
            qty10INR,
            qty20INR,
            qty50INR,
            qty100INR,
            qty200INR,
            qty500INR,
            qty2000INR
    } = req.body;

    if(!req.body || !plantId || !closingBalanceAmount) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const denominationTotalAmount = (
    qty1INR * 1 +
    qty2INR * 2 +
    qty5INR * 5 +
    qty10INR * 10 +
    qty20INR * 20 +
    qty50INR * 50 +
    qty100INR * 100 +
    qty200INR * 200 +
    qty500INR * 500 +
    qty2000INR * 2000
    )


    if(denominationTotalAmount !== closingBalanceAmount) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DENOMINATION_NOT_MATCH,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const denominationData: PlantClosingDenominationAttributes = {
      plantId,
      closingBalanceAmount,
      denominationTotalAmount,
      qty1INR,
      qty2INR,
      qty5INR,
      qty10INR,
      qty20INR,
      qty50INR,
      qty100INR,
      qty200INR,
      qty500INR,
      qty2000INR,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    }

    await PlantClosingDenomination.create(denominationData);

    const response = responseFormatter(
      CODE[201],
      SUCCESS.TRUE,
      MESSAGE.DAY_CLOSED,
      null,
    );
    res.status(CODE[201]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { storeDenomination };
