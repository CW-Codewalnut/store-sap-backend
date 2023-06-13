import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Employee from '../models/employee';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import Plant from '../models/plant';
import MESSAGE from '../config/message.json';
import User from '../models/user';

const getEmployeesByPlantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { plantId } = req.params;
    const employees = await Employee.findAll({
      where: { plantId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      employees,
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
          employeeCode: { [Op.like]: `%${search}%` },
          employeeName: { [Op.like]: `%${search}%` },
        },
      };
    }

    const employees = await Employee.findAndCountAll({
      include: [
        {
          model: Plant,
          attributes: ['id', 'plantCode', 'plant'],
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
      employees,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const query = [];

    if (search) {
      const condition = {
        [Op.or]: {
          employeeCode: { [Op.like]: `%${search}%` },
          employeeName: { [Op.like]: `%${search}%` },
        },
      };
      query.push(condition);
    }

    const users = await User.findAll({
      attributes: ['employeeCode'],
      raw: true,
    });

    if (Array.isArray(users) && users.length) {
      const usersEmployeeCodes = users.map((user) => user.employeeCode);
      query.push({ employeeCode: { [Op.notIn]: usersEmployeeCodes } });
    }

    const employees = await Employee.findAll({
      where: { [Op.and]: query },
      order: [['employeeName', 'ASC']],
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      employees,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

export default { getEmployeesByPlantId, findWithPaginate, findAll };
