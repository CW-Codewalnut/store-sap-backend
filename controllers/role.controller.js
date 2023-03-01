const Role = require('../models').role;
const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');

module.exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['name', 'ASC']],
    });

    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', roles);
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};
