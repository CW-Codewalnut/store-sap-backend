import { Request, Response, NextFunction } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import SessionActivity from '../models/session-activity';
import sessionActivityArgs from '../interfaces/sessionActivity/sessionActivity.interface';
import MESSAGE from '../config/message.json';

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
    SUCCESS.FALSE,
    MESSAGE.UNAUTHORIZED,
    null,
  );
  return res.status(CODE[401]).send(response);
};

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.ACCESS_ALLOWED,
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
      SUCCESS.TRUE,
      MESSAGE.AUTHORIZED,
      null,
    );
    return res.status(CODE[200]).send(response);
  }
  const response = responseFormatter(
    CODE[401],
    SUCCESS.FALSE,
    MESSAGE.UNAUTHORIZED,
    null,
  );
  return res.status(CODE[401]).send(response);
};

const saveSessionActivity = ({
  req,
  userId,
  sessionId,
  callBackFn,
}: sessionActivityArgs) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
      || req.socket.remoteAddress;
    const device = req.headers['user-agent'];

    const body: any = {
      userId,
      sessionId,
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
