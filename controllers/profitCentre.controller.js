const ProfitCentre = require('../models').profit_centre;
const { format } = require('../config/response');

module.exports.getProfitCentreByCostCentreId = async (req, res) => {
  try {
    const { costCentreId } = req.params;
    const profitCentres = await ProfitCentre.findAll({
      where: { costCentreId },
    });
    const response = format('200', 'success', 'Fetched', profitCentres);
    res.status(200).send(response);
  } catch (err) {
    const response = format('400', 'failure', err, null);
    res.send(response);
  }
};
