import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import CashDenomination from '../models/cash-denomination';

const getDenomination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cashJournalId } = req.params;

    let cashDenomination;

    cashDenomination = await CashDenomination.findOne({
      where: {
        [Op.and]: [{ plantId: req.session.activePlantId }, { cashJournalId }],
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
  } catch (err) {
    next(err);
  }
};

export default { getDenomination };
