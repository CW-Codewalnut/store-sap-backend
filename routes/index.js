const passport = require('passport');

const UserController = require('../controllers/user.controller');
const PlantController = require('../controllers/plant.controller');
const CostCenterController = require('../controllers/costCentre.controller');
const profitCenterController = require('../controllers/profitCentre.controller');
const segmentController = require('../controllers/segment.controller');

// const isRouteProtected = passport.authenticate('local', { session: true });
const isRouteProtected = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.post('/auth', UserController.auth);
  // app.use(passport.authenticate('local', { session: true }));
  app.get('/users/paginate', isRouteProtected, UserController.findWithPaginate);
  app.post('/logout', UserController.logout);
  app.post('/user', UserController.create);

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
