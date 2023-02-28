const ProfitCentre = require('../models').profit_centre;
const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');

module.exports.getProfitCentreByCostCentreId = async (req, res) => {
  try {
    const { costCentreId } = req.params;
    const profitCentres = await ProfitCentre.findAll({
      where: { costCentreId },
    });
    const response = format(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      profitCentres,
    );
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};
