const UserController = require('../controllers/user.controller');
const PlantController = require('../controllers/plant.controller');
const CostCenterController = require('../controllers/costCentre.controller');
const profitCenterController = require('../controllers/profitCentre.controller');
const segmentController = require('../controllers/segment.controller');

const { checkAuthenticated } = require('../middleware/auth');

module.exports = (app) => {
  app.post('/auth', UserController.auth);

  app.get(
    '/users/paginate',
    checkAuthenticated,
    UserController.findWithPaginate,
  );
  app.get('/logout', checkAuthenticated, UserController.logout);
  app.post('/user', checkAuthenticated, UserController.create);

  app.get(
    '/plants/:userId',
    checkAuthenticated,
    PlantController.getPlantsByUserId,
  );

  app.get(
    '/cost-centres/:plantId',
    checkAuthenticated,
    CostCenterController.getCostCentreByPlantId,
  );

  app.get(
    '/profit-centres/:costCentreId',
    checkAuthenticated,
    profitCenterController.getProfitCentreByCostCentreId,
  );

  app.get(
    '/segments/:profitCentreId',
    checkAuthenticated,
    segmentController.getSegmentsByProfitCentreId,
  );
};
