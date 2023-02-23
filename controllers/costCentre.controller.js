const CostCentre = require('../models').cost_centre;
const { format } = require('../config/response');

module.exports.getCostCentreByPlantId = async (req, res) => {
  try {
    const { plantId } = req.params;
    const costCentres = await CostCentre.findAll({
      where: { plantId },
    });
    const response = format('200', 'success', 'Fetched', costCentres);
    res.status(200).send(response);
  } catch (err) {
    const response = format('400', 'failure', err, null);
    res.send(response);
  }
};
