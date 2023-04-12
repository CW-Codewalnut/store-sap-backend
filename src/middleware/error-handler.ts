import { Request, Response, NextFunction } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import jwt from 'jsonwebtoken';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const errStatus = err.statusCode || CODE[500];
  let errMsg;

  if (err instanceof ForeignKeyConstraintError) {
    errMsg = MESSAGE.FOREIGN_KEY_ERROR;
  } else if (err instanceof jwt.TokenExpiredError) {
    errMsg = MESSAGE.PASSWORD_EXPIRED_LINK;
  } else {
    errMsg = err.message || MESSAGE.SOMETHING_WENT_WRONG;
  }

  const stack: any = process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev'
    ? err.stack
    : {};

  const response = responseFormatter(errStatus, SUCCESS.TRUE, errMsg, stack);
  res.status(CODE[500]).send(response);
};

export default ErrorHandler;
