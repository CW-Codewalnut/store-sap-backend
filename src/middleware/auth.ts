import { Request, Response, NextFunction } from 'express';
import { responseFormatter, CODE, STATUS } from '../config/response';
import { MESSAGE } from '../utils/constant';
import SessionActivity from '../models/session-activity';
import sessionActivityArgs from '../interfaces/sessionActivity/sessionActivity.interface';

const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const response = responseFormatter(
    CODE[401],
    STATUS.FAILURE,
    MESSAGE.UNAUTHORIZED,
    null,
  );
  return res.status(CODE[401]).send(response);
};

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Access allowed',
      null,
    );
    return res.status(CODE[200]).send(response);
  }
  return next();
};

const verifyRouteAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      MESSAGE.AUTHORIZED,
      null,
    );
    return res.status(CODE[200]).send(response);
  }
  const response = responseFormatter(
    CODE[401],
    STATUS.FAILURE,
    MESSAGE.UNAUTHORIZED,
    null,
  );
  return res.status(CODE[401]).send(response);
};

const saveSessionActivity = ({
  req,
  userId,
  callBackFn,
}: sessionActivityArgs) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
      || req.socket.remoteAddress;
    const device = req.headers['user-agent'];

    const body: any = {
      userId,
      isExpired: req.body.isExpired,
      device,
      ip,
      lat: req.body.lat,
      long: req.body.long,
    };
    SessionActivity.create(body);
    return callBackFn(null);
  } catch (err) {
    return callBackFn('Failed to create session activity.');
  }
};

export {
  checkAuthenticated,
  checkLoggedIn,
  verifyRouteAccess,
  saveSessionActivity,
};
