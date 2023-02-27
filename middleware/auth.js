const { format } = require('../config/response');

module.exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const response = format('400', 'failed', 'Bad request', null);
  return res.send(response);
};

module.exports.checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    const response = format('200', 'success', 'Access allowed', null);
    return res.send(response);
  }
  return next();
};
