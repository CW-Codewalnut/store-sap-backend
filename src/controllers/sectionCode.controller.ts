import { NextFunction, Request, Response } from 'express';
import SectionCode from '../models/section-code';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const getSectionCodeByBusinessPlaceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessPlaceId } = req.params;
    const bankAccounts = await SectionCode.findAll({
      where: { businessPlaceId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      bankAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getSectionCodeByBusinessPlaceId };
