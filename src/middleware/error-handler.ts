import {Request, Response, NextFunction} from 'express';
import {responseFormatter, CODE, SUCCESS} from '../config/response';

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const errStatus = err.statusCode || CODE[500];
  const errMsg = err.message || 'Something went wrong';
  const stack: any =
    process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev'
      ? err.stack
      : {};

  const response = responseFormatter(errStatus, SUCCESS.TRUE, errMsg, stack);
  res.status(CODE[500]).send(response);
};

export default ErrorHandler;
