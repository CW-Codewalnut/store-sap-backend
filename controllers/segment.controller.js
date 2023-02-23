const Segment = require('../models').segment;
const { format } = require('../config/response');

module.exports.getSegmentsByProfitCentreId = async (req, res) => {
  try {
    const { profitCentreId } = req.params;
    const Segments = await Segment.findAll({
      where: { profitCentreId },
    });
    const response = format('200', 'success', 'Fetched', Segments);
    res.status(200).send(response);
  } catch (err) {
    const response = format('400', 'failure', err, null);
    res.send(response);
  }
};
