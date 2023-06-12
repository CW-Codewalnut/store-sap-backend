import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import CashDenomination from '../models/cash-denomination';
import Session from '../models/session';
import SessionModel from '../interfaces/masters/session.interface';

const getDenomination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cashJournalId } = req.params;

    let cashDenomination;
    
    const sessionData = await Session.findOne({ where: { sid: req.session.id } });

    if(sessionData) {
      const expressSessionData = JSON.parse(sessionData.data);

      cashDenomination = await CashDenomination.findOne({
        where: {
          [Op.and]: [{ plantId: expressSessionData.activePlantId }, { cashJournalId }],
        },
        raw: true,
      });
  
      if (!cashDenomination) {
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
          qty2000INR: 0,
        };
      }
  
      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.FETCHED,
        cashDenomination,
      );
      res.status(CODE[200]).send(response);
    } else {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.SOMETHING_WENT_WRONG,
        null,
      );
      res.status(CODE[400]).send(response);
    }
  } catch (err) {
    next(err);
  }
};

export default { getDenomination };
