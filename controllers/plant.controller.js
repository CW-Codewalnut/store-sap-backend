const UserPlant = require('../models').user_plant;
const Plant = require('../models').plant;
const { format, RESPONSE: { CODE, STATUS } } = require('../config/response');

module.exports.getPlantsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const plants = await UserPlant.findAll({
      include: [
        {
          model: Plant,
        },
      ],
      where: { userId },
    });
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', plants);
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};
