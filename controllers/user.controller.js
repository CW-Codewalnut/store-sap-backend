const md5 = require('md5');
const db = require('../models');

const User = require('../models').user;
const { format } = require('../config/response');
const { validateEmail } = require('../utils/helper');

const { Op } = db;

module.exports.auth = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      const response = format(
        '400',
        'failure',
        'Content can not be empty!',
        null,
      );
      return res.send(response);
    }

    const { email, password } = req.body;

    if (!validateEmail(email)) {
      const response = format('400', 'failure', 'Incorrect credentials!', null);
      return res.send(response);
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const response = format('400', 'failure', "Email isn't exist!", null);
      return res.send(response);
    }

    const passDb = user.password;
    const passUser = md5(password.trim());

    let response;

    if (passDb === passUser) {
      req.session.userId = user.id;
      response = format('200', 'success', 'Login success', null);
    } else {
      response = format('400', 'failure', 'Incorrect credentials!', null);
    }

    return res.send(response);
  } catch (err) {
    const response = format('400', 'failure', JSON.stringify(err), null);
    return res.send(response);
  }
};

module.exports.logout = async (req, res) => {
  try {
    // req.logout();
    req.session.destroy();
    // res.redirect(process.env.BASEURL);
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
