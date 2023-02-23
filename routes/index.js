const UserController = require('../controllers/user.controller');
const PlantController = require('../controllers/plant.controller');
const CostCenterController = require('../controllers/costCentre.controller');
const profitCenterController = require('../controllers/profitCentre.controller');
const segmentController = require('../controllers/segment.controller');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/users/paginate', UserController.findWithPaginate);

  app.get('/plants/:userId', PlantController.getPlantsByUserId);

  app.get(
    '/cost-centres/:plantId',
    CostCenterController.getCostCentreByPlantId,
  );

  app.get(
    '/profit-centres/:costCentreId',
    profitCenterController.getProfitCentreByCostCentreId,
  );

  app.get(
    '/segments/:profitCentreId',
    segmentController.getSegmentsByProfitCentreId,
  );
};
