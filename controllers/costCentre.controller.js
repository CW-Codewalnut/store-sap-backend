const CostCentre = require('../models').cost_centre;
const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');

module.exports.getCostCentreByPlantId = async (req, res) => {
  try {
    const { plantId } = req.params;
    const costCentres = await CostCentre.findAll({
      where: { plantId },
    });
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', costCentres);
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};
