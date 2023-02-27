const md5 = require('md5');
const passport = require('passport');
const db = require('../models');

const User = require('../models').user;
const { format } = require('../config/response');

const { Op } = db;

module.exports.auth = async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const response = format('400', 'failure', 'Invalid credentials', null);
      return res.send(response);
    }
    return req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      req.session.userId = user.id;
      const response = format('200', 'success', 'Login successfully', null);
      return res.send(response);
    });
  })(req, res, next);
};

module.exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    const response = format('200', 'success', 'Logout securely', null);
    return res.send(response);
  } catch (err) {
    const response = format('400', 'failure', JSON.stringify(err), null);
    return res.send(response);
  }
};

module.exports.create = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      const response = format(
        '400',
        'failure',
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password.trim());
    }

    await User.create(req.body);
    const response = format('201', 'success', 'Created', null);
    return res.status(201).send(response);
  } catch (err) {
    const response = format('400', 'failure', JSON.stringify(err), null);
    return res.send(response);
  }
};

module.exports.findWithPaginate = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const { search } = req.query;
    const offset = page * pageSize - pageSize;
    const limit = pageSize;
    console.log('user=============> ', req.user);
    let condition = {};

    if (search) {
      condition = {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          mobile: { [Op.like]: `%${search}%` },
          email: { [Op.like]: `%${search}%` },
        },
      };
    }

    const users = await User.findAndCountAll({
      where: condition,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    const response = format('200', 'success', 'Fetched', users);
    res.status(200).send(response);
  } catch (err) {
    const response = format('400', 'failure', err, null);
    res.send(response);
  }
};
