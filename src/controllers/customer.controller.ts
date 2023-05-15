import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Customer from '../models/customer';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import PaymentTerm from '../models/payment-term';
import MESSAGE from '../config/message.json';

const findWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const { search } = req.query;
    const offset = page * pageSize - pageSize;
    const limit = pageSize;
    let condition = {};

    if (search) {
      condition = {
        [Op.or]: {
          customerNo: { [Op.like]: `%${search}%` },
          customerName1: { [Op.like]: `%${search}%` },
          customerName2: { [Op.like]: `%${search}%` },
          customerName3: { [Op.like]: `%${search}%` },
          mobile: { [Op.like]: `%${search}%` },
          email1: { [Op.like]: `%${search}%` },
          email2: { [Op.like]: `%${search}%` },
        },
      };
    }

    const customers = await Customer.findAndCountAll({
      where: condition,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      customers,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findWithPaginate };
