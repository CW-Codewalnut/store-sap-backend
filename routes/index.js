const UserController = require('../controllers/user.controller');
const PlantController = require('../controllers/plant.controller');
const CostCenterController = require('../controllers/costCentre.controller');
const ProfitCenterController = require('../controllers/profitCentre.controller');
const SegmentController = require('../controllers/segment.controller');
const RoleController = require('../controllers/role.controller');
const { checkAuthenticated } = require('../middleware/auth');

module.exports = (app) => {
  app.post('/auth', UserController.auth);
  app.get('/logout', checkAuthenticated, UserController.logout);

  app.post('/user', checkAuthenticated, UserController.create);
  app.get(
    '/users/paginate',
    checkAuthenticated,
    UserController.findWithPaginate,
  );
  app.get('/users/:id', checkAuthenticated, UserController.findById);
  app.patch('/users/:id', checkAuthenticated, UserController.update);

  app.get('/roles', checkAuthenticated, RoleController.findAll);
  app.post('/role', checkAuthenticated, RoleController.create);
  app.get('/roles/:id', checkAuthenticated, RoleController.findById);
  app.patch('/roles/:id', checkAuthenticated, RoleController.update);
  app.get(
    '/roles/:id/permissions',
    checkAuthenticated,
    RoleController.findRolePermissions,
  );

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
    ProfitCenterController.getProfitCentreByCostCentreId,
  );

  app.get(
    '/segments/:profitCentreId',
    checkAuthenticated,
    SegmentController.getSegmentsByProfitCentreId,
  );
};
