const UserPlant = require('../models').user_plant;
const Plant = require('../models').plant;
const { format } = require('../config/response');

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
    const response = format('200', 'success', 'Fetched', plants);
    res.status(200).send(response);
  } catch (err) {
    const response = format('400', 'failure', err, null);
    res.send(response);
  }
};
