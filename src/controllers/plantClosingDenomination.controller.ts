import { NextFunction, Request, Response } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import PlantClosingDenomination from '../models/plant-closing-denomination';
import { Op } from 'sequelize';

const createOrUpdateDenomination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      id,
      cashJournalId,
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
      qty2000INR,
    } = req.body;

    if (!req.body || !cashJournalId || !closingBalanceAmount) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const denominationTotalAmount = qty1INR * 1
      + qty2INR * 2
      + qty5INR * 5
      + qty10INR * 10
      + qty20INR * 20
      + qty50INR * 50
      + qty100INR * 100
      + qty200INR * 200
      + qty500INR * 500
      + qty2000INR * 2000;

    const denominationData: any = {
      id: id,
      plantId: req.session.activePlantId,
      cashJournalId,
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
    };

    const [instance,] = await PlantClosingDenomination.upsert(denominationData);

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.DENOMINATION_UPDATED,
      instance,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const getDenomination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cashJournalId } = req.params;

    let cashDenomination;

    cashDenomination = await PlantClosingDenomination.findOne({
      where: {
          [Op.and]: [
            {plantId: req.session.activePlantId},
            {cashJournalId: cashJournalId}
          ]
        },
      raw: true
    })

    if(!cashDenomination) {
      cashDenomination = {
        id: null,
        denominationTotalAmount: 0,
        qty1INR: 0,
        qty2INR: 0,
        qty5INR: 0,
        qty10INR: 0,
        qty20INR: 0,
        qty50INR: 0,
        qty100INR: 0,
        qty200INR: 0,
        qty500INR: 0,
        qty2000INR: 0
      }
    }

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      cashDenomination
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { createOrUpdateDenomination, getDenomination };
