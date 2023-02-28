const Segment = require('../models').segment;
const {
  format,
  RESPONSE: { CODE, STATUS },
} = require('../config/response');

module.exports.getSegmentsByProfitCentreId = async (req, res) => {
  try {
    const { profitCentreId } = req.params;
    const Segments = await Segment.findAll({
      where: { profitCentreId },
    });
    const response = format(CODE[200], STATUS.SUCCESS, 'Fetched', Segments);
    res.status(200).send(response);
  } catch (err) {
    const response = format(CODE[500], STATUS.FAILURE, err, null);
    res.send(response);
  }
};
