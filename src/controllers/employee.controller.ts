import { NextFunction, Request, Response } from 'express';
import Employee from '../models/employee';
import { responseFormatter, CODE, SUCCESS } from '../config/response';

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
      'Fetched',
      employees,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { getEmployeesByPlantId };
