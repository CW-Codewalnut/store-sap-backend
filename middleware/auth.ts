import { Request, Response, NextFunction } from 'express';

import { format, CODE, STATUS } from '../config/response';

const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const response = format(CODE[440], STATUS.FAILURE, 'Bad request', null);
  return res.send(response);
};

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const response = format(CODE[200], STATUS.SUCCESS, 'Access allowed', null);
    return res.send(response);
  }
  return next();
};

export { checkAuthenticated, checkLoggedIn };
/* module.exports.saveSessionActivity = ({ req, userId }, cb) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim()
      || req.socket.remoteAddress;
    const device = req.headers['user-agent'];

    const body = {
      userId,
      isExpired: req.body.isExpired,
      device,
      ip,
      lat: req.body.lat,
      long: req.body.long,
    };
    SessionActivity.create(body);
    return cb(null);
  } catch (err) {
    return cb('Failed to create session activity.');
  }
}; */
