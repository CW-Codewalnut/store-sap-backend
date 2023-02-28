const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');
const SessionActivity = require('../models').session_activity;

module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const response = format(CODE[440], STATUS.FAILURE, 'Bad request', null);
  return res.send(response);
};

module.exports.checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    const response = format(CODE[200], STATUS.SUCCESS, 'Access allowed', null);
    return res.send(response);
  }
  return next();
};

module.exports.saveSessionActivity = ({ req, userId }, cb) => {
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
};
