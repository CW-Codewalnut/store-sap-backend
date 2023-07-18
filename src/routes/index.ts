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
import UserPlantController from '../controllers/userPlant.controller';

import { checkAuthenticated, verifyRouteAccess } from '../middleware/auth';
import CashJournalController from '../controllers/cashJournal.controller';
import CashDenominationController from '../controllers/cashDenomination.controller';
import PostingKeyController from '../controllers/postingKey.controller';
import PosMidListController from '../controllers/posMidList.controller';
import DocumentTypeController from '../controllers/documentType.controller';
import SalesReceiptController from '../controllers/salesReceipt.controller';
import OneTimeCustomerController from '../controllers/oneTimeCustomer.controller';
import SpecialGlIndicatorController from '../controllers/specialGlIndicator.controller';
import BusinessPlaceController from '../controllers/businessPlace.controller';
import SectionCodeController from '../controllers/sectionCode.controller';
import WithholdingTaxController from '../controllers/withholdingTax.controller';
import ExpenseController from '../controllers/expense.controller';

const routesMiddleware = (app: Application) => {
  // Auth api
  app.post('/auth', UserController.auth);
  app.get('/route/verify', verifyRouteAccess);
  app.get('/logout', checkAuthenticated, UserController.logout);
  app.post('/user/set-password', UserController.setUserPassword);
  app.post(
    '/employee/verify-employee-code',
    UserController.verifyAndSendPasswordResetLink,
  );

  // Masters api
  app.get(
    '/users/paginate',
    checkAuthenticated,
    UserController.findWithPaginate,
  );

  app.post('/user', checkAuthenticated, UserController.create);

  app.get('/users/:id', checkAuthenticated, UserController.findById);
  app.patch('/users/:id', checkAuthenticated, UserController.update);
  app.get(
    '/users/change-account-status/:userId',
    checkAuthenticated,
    UserController.changeAccountStatus,
  );

  app.get(
    '/user/password-link-regenerate/:userId',
    checkAuthenticated,
    UserController.setUserPasswordLinkReGenerate,
  );

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

  app.get('/permissions', checkAuthenticated, RoleController.getAllPermissions);

  app.get(
    '/user/plants',
    checkAuthenticated,
    PlantController.getPlantsByUserId,
  );

  app.get('/plants', checkAuthenticated, PlantController.findAll);

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
    '/profit-centres/by/:plantId',
    checkAuthenticated,
    ProfitCenterController.getProfitCentreByPlantId,
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
    '/employees/paginate',
    checkAuthenticated,
    EmployeeController.findWithPaginate,
  );

  app.get(
    '/employees/:plantId',
    checkAuthenticated,
    EmployeeController.getEmployeesByPlantId,
  );

  app.post(
    '/gl-accounts',
    checkAuthenticated,
    GlAccountController.getGlAccounts,
  );

  app.get('/tax-codes', checkAuthenticated, TaxCodeController.findAll);

  app.get('/vendors', checkAuthenticated, VendorController.findAll);

  app.get(
    '/customers/paginate',
    checkAuthenticated,
    CustomerController.findWithPaginate,
  );

  app.get('/employees', checkAuthenticated, EmployeeController.findAll);

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
  app.post(
    '/petty-cash/export',
    checkAuthenticated,
    PettyCashController.exportPettyCash,
  );
  app.post(
    '/petty-cash/update/status',
    checkAuthenticated,
    PettyCashController.updateDocumentStatus,
  );

  app.delete(
    '/petty-cash/delete',
    checkAuthenticated,
    PettyCashController.deleteTransactions,
  );

  app.post(
    '/petty-cash/balance-calculation',
    checkAuthenticated,
    PettyCashController.getBalanceCalculation,
  );

  app.get(
    '/plant/selected/:plantId',
    checkAuthenticated,
    UserPlantController.updateUserActivePlant,
  );

  app.post(
    '/petty-cash/transaction-reverse',
    checkAuthenticated,
    PettyCashController.transactionReverse,
  );

  app.get(
    '/cash-journal/:plantId',
    checkAuthenticated,
    CashJournalController.getCashJournalByPlantId,
  );

  app.get(
    '/cash-denomination/:cashJournalId',
    checkAuthenticated,
    CashDenominationController.getDenomination,
  );

  app.get('/posting-keys', checkAuthenticated, PostingKeyController.findAll);

  app.get('/pos-mis-lists', checkAuthenticated, PosMidListController.findAll);

  app.get(
    '/document-types/:businessTransactionId',
    checkAuthenticated,
    DocumentTypeController.findAll,
  );
  app.post(
    '/sales-receipt/header',
    checkAuthenticated,
    SalesReceiptController.createSalesHeader,
  );
  app.post(
    '/sales-receipt/debit',
    checkAuthenticated,
    SalesReceiptController.createSalesDebitTransaction,
  );
  app.post(
    '/sales-receipt/credit',
    checkAuthenticated,
    SalesReceiptController.createSalesCreditTransaction,
  );
  app.post(
    '/one-time-customer',
    checkAuthenticated,
    OneTimeCustomerController.create,
  );
  app.post(
    '/sales-receipt/transaction-reverse',
    checkAuthenticated,
    SalesReceiptController.transactionReverse,
  );
  app.post(
    '/sales-receipt/update/status',
    checkAuthenticated,
    SalesReceiptController.updateDocumentStatus,
  );
  app.delete(
    '/sales-receipt/line-item/delete',
    checkAuthenticated,
    SalesReceiptController.deleteLineItem,
  );
  app.delete(
    '/sales-receipt/delete',
    checkAuthenticated,
    SalesReceiptController.deleteDocument,
  );

  app.get(
    '/sales-receipt/last-document',
    checkAuthenticated,
    SalesReceiptController.getLastDocument,
  );

  app.get(
    '/sales-receipt/:documentNumber',
    checkAuthenticated,
    SalesReceiptController.findByDocumentNumber,
  );

  app.post(
    '/sales-receipt/export',
    checkAuthenticated,
    SalesReceiptController.exportSalesReceipt,
  );
  app.get(
    '/special-gl-accounts',
    checkAuthenticated,
    SpecialGlIndicatorController.findAll,
  );
  app.get(
    '/business-places',
    checkAuthenticated,
    BusinessPlaceController.findAll,
  );
  app.get(
    '/section-codes',
    checkAuthenticated,
    SectionCodeController.getSectionCodeByBusinessPlaceId,
  );
  app.get(
    '/withholding-taxes',
    checkAuthenticated,
    WithholdingTaxController.findAll,
  );
  app.post(
    '/expenses/header',
    checkAuthenticated,
    ExpenseController.createExpensesHeader,
  );
  app.post(
    '/expenses/debit',
    checkAuthenticated,
    ExpenseController.createExpensesDebitTransaction,
  );
  app.post(
    '/expenses/credit',
    checkAuthenticated,
    ExpenseController.createExpensesCreditTransaction,
  );
  app.post(
    '/expenses/transaction-reverse',
    checkAuthenticated,
    ExpenseController.exportSalesReceipt,
  );
  app.post(
    '/expenses/update-document-status',
    checkAuthenticated,
    ExpenseController.exportSalesReceipt,
  );
};

export default routesMiddleware;
