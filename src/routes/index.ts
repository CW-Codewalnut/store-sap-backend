import { Application } from 'express';

import UserController from '../controllers/user.controller';
import PlantController from '../controllers/plant.controller';
import CostCenterController from '../controllers/costCentre.controller';
import ProfitCenterController from '../controllers/profitCentre.controller';
import SegmentController from '../controllers/segment.controller';
import RoleController from '../controllers/role.controller';
import HouseBankController from '../controllers/houseBank.controller';
import BankAccountController from '../controllers/bankAccount.controller';
import BusinessTransactionController from '../controllers/businessTransaction.controller';
import EmployeeController from '../controllers/employee.controller';
import GlAccountController from '../controllers/glAccount.controller';
import PaymentTermController from '../controllers/paymentTerm.controller';
import TaxCodeController from '../controllers/taxCode.controller';
import VendorController from '../controllers/vendor.controller';
import CustomerController from '../controllers/customer.controller';
import PettyCashController from '../controllers/pettyCash.controller';

import { checkAuthenticated, verifyRouteAccess } from '../middleware/auth';

const routesMiddleware = (app: Application) => {
  // Auth api
  app.post('/auth', UserController.auth);
  app.get('/route/verify', verifyRouteAccess);
  app.get('/logout', checkAuthenticated, UserController.logout);

  // Masters api
  app.get(
    '/users/paginate',
    checkAuthenticated,
    UserController.findWithPaginate,
  );

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

  app.get('/payment-terms', checkAuthenticated, PaymentTermController.findAll);

  app.get('/house-banks', checkAuthenticated, HouseBankController.findAll);

  app.get(
    '/bank-accounts/:houseBankId',
    checkAuthenticated,
    BankAccountController.getAccountsByHouseBankId,
  );

  app.get(
    '/get-all-masters/:moduleId',
    checkAuthenticated,
    BusinessTransactionController.getMasters,
  );

  app.get(
    '/business-transactions/:moduleId',
    checkAuthenticated,
    BusinessTransactionController.getBusinessTransactionsByModuleId,
  );

  app.get(
    '/employees/:plantId',
    checkAuthenticated,
    EmployeeController.getEmployeesByPlantId,
  );

  app.get(
    '/gl-accounts/:businessTransactionId',
    checkAuthenticated,
    GlAccountController.getGlAccountsByBusinessTransactionId,
  );

  app.get('/tax-codes', checkAuthenticated, TaxCodeController.findAll);

  app.get('/vendors', checkAuthenticated, VendorController.findAll);

  app.get(
    '/customers/paginate',
    checkAuthenticated,
    CustomerController.findWithPaginate,
  );

  app.get(
    '/employees/:plantId/paginate',
    checkAuthenticated,
    EmployeeController.findWithPaginate,
  );

  app.get(
    '/vendors/paginate',
    checkAuthenticated,
    VendorController.findWithPaginate,
  );

  // Petty cash api
  app.post('/petty-cash', checkAuthenticated, PettyCashController.create);
  app.post(
    '/petty-cash/payments/paginate',
    checkAuthenticated,
    PettyCashController.findPaymentsWithPaginate,
  );
  app.post(
    '/petty-cash/receipts/paginate',
    checkAuthenticated,
    PettyCashController.findReceiptsWithPaginate,
  );
  app.patch(
    '/petty-cash/:transactionId',
    checkAuthenticated,
    PettyCashController.update,
  );
  app.get(
    '/petty-cash/export',
    checkAuthenticated,
    PettyCashController.exportPettyCash,
  );
  app.post(
    '/petty-cash/update/status',
    checkAuthenticated,
    PettyCashController.updateDocumentStatus,
  );
};

export default routesMiddleware;
