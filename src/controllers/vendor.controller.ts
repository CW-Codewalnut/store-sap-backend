import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Vendor from '../models/vendor';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import PaymentTerm from '../models/payment-term';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await Vendor.findAll();
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      vendors,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

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
          name1: { [Op.like]: `%${search}%` },
          name2: { [Op.like]: `%${search}%` },
          searchTerm1: { [Op.like]: `%${search}%` },
          searchTerm2: { [Op.like]: `%${search}%` },
          mobileNo: { [Op.like]: `%${search}%` },
          email: { [Op.like]: `%${search}%` },
        },
      };
    }

    const vendors = await Vendor.findAndCountAll({
      include: [
        {
          model: PaymentTerm,
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
      vendors,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll, findWithPaginate };
