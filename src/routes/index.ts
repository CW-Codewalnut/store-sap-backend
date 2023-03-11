import { Application } from 'express';

import UserController from '../controllers/user.controller';
import PlantController from '../controllers/plant.controller';
import CostCenterController from '../controllers/costCentre.controller';
import ProfitCenterController from '../controllers/profitCentre.controller';
import SegmentController from '../controllers/segment.controller';
import RoleController from '../controllers/role.controller';

import { checkAuthenticated } from '../middleware/auth';

const routesMiddleware = (app: Application) => {
  app.post('/auth', UserController.auth);
  app.get(
    '/users/paginate',
    checkAuthenticated,
    UserController.findWithPaginate,
  );
  app.get('/logout', checkAuthenticated, UserController.logout);

  app.post('/user', checkAuthenticated, UserController.create);

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

  app.patch(
    '/roles/:id/permissions',
    checkAuthenticated,
    RoleController.updateRolePermissions,
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

export default routesMiddleware;
