import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Customer from '../models/customer';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import PaymentTerm from '../models/payment-term';
import MESSAGE from '../config/message.json';
import GlAccount from '../models/gl-account';

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
          mobile: { [Op.like]: `%${search}%` },
          gstNo: { [Op.like]: `%${search}%` },
        },
      };
    }

    const customers = await Customer.findAndCountAll({
      include: [
        {
          model: PaymentTerm,
          attributes: {
            exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: GlAccount,
          attributes: {
            exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt'],
          },
        },
      ],
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
