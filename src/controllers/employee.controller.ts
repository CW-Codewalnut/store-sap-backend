import {Request, Response} from 'express';
import Employee from '../models/employee';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getEmployeesByPlantId = async (req: Request, res: Response) => {
  try {
    const {plantId} = req.params;
    const employees = await Employee.findAll({
      where: {plantId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      employees,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getEmployeesByPlantId};
