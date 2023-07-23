import { NextFunction, Request, Response } from 'express';
import { BigNumber } from 'bignumber.js';
import * as xlsx from 'xlsx';
import { Op } from 'sequelize';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import SalesHeader from '../models/sales-header';
import SalesDebitTransaction from '../models/sales-debit-transaction';
import SalesCreditTransaction from '../models/sales-credit-transaction';
import BusinessTransaction from '../models/business-transaction';
import GlAccount from '../models/gl-account';
import Customer from '../models/customer';
import DocumentType from '../models/document-type';
import PostingKey from '../models/posting-key';
import PosMidList from '../models/pos-mid-list';
import ProfitCentre from '../models/profit-centre';
import Plant from '../models/plant';
import Preference from '../models/preference';
import OneTimeCustomer from '../models/one-time-customer';
import SalesHeaderModel, {
  SalesHeaderWithDocumentLabel,
} from '../interfaces/masters/salesHeader.interface';
import { dateFormat } from '../utils/helper';
import { SalesCreditTransactionModelWithIncludes } from '../interfaces/masters/salesCreditTransaction.interface';
import { SalesDebitTransactionModelWithIncludes } from '../interfaces/masters/salesDebitTransaction.interface';
import OneTimeCustomerModel from '../interfaces/masters/oneTimeCustomer.interface';
import ExpensesHeader from '../models/expenses-header';
import ExpensesDebitTransaction from '../models/expenses-debit-transaction';
import CostCentre from '../models/cost-centre';
import TaxCode from '../models/tax-code';
import BusinessPlace from '../models/business-place';
import SpecialGlIndicator from '../models/special-gl-indicator';
import ExpensesHeaderModel, {
  ExpensesHeaderWithDocumentLabel,
} from '../interfaces/masters/expensesHeader.interface';
import ExpensesCreditTransaction from '../models/expenses-credit-transaction';
import { ExpensesDebitTransactionModelWithIncludes } from '../interfaces/masters/expensesDebitTransaction.interface';
import Vendor from '../models/vendor';
import SectionCode from '../models/section-code';
import WithholdingTax from '../models/withholding-tax';
import { ExpensesCreditTransactionModelWithIncludes } from '../interfaces/masters/expensesCreditTransaction.interface';

const createExpensesHeader = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.session.activePlantId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.SELECT_PLANT,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const headerBody = {
      ...req.body,
      plantId: req.session.activePlantId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (req.body.expensesHeaderId) {
      Object.assign(headerBody, { id: req.body.expensesHeaderId });
    }

    const [expensesHeader] = await ExpensesHeader.upsert(headerBody);

    const expensesHeaderData = await ExpensesHeader.findOne({
      where: {
        id: expensesHeader.id,
      },
      include: [
        {
          model: Plant,
        },
      ],
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      expensesHeaderData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const createExpensesDebitTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const debitTransaction = {
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (req.body.expensesDebitTransactionId) {
      Object.assign(debitTransaction, {
        id: req.body.expensesDebitTransactionId,
      });
    }

    await ExpensesDebitTransaction.upsert(debitTransaction);
    const expensesDebitTransactions = await ExpensesDebitTransaction.findAll({
      where: {
        expensesHeaderId: req.body.expensesHeaderId,
      },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: TaxCode,
        },
        {
          model: BusinessPlace,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      expensesDebitTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

/**
 * This function returns false if the provided amount exceeds the specified limit;
 * otherwise, it returns true.
 * @param amount
 * @returns
 */
const checkValidAmount = async (amount: number): Promise<boolean> => {
  try {
    const isValidAmount = await Preference.findOne({
      where: {
        [Op.and]: [
          { name: 'salesReceiptCashLimit' },
          { value: { [Op.gt]: amount } },
        ],
      },
      raw: true,
    });
    return !!isValidAmount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Calculate amount if payment method is cash
 * @param salesHeaderId
 * @returns
 */
const getSumOfAmountForCash = async (
  salesHeaderId: string,
): Promise<number> => {
  try {
    const totalUpdatingAmount = await SalesCreditTransaction.sum('amount', {
      where: {
        [Op.and]: [{ salesHeaderId }, { paymentMethod: 'Cash' }],
      },
    });

    return totalUpdatingAmount ?? 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Check line item one consist at least one transaction;
 * @param expensesHeaderId
 * @returns
 */
const checkLineItemOneExist = async (
  expensesHeaderId: string,
): Promise<number> => {
  try {
    const debitTransactionCount = await ExpensesDebitTransaction.count({
      where: {
        expensesHeaderId,
      },
    });

    return debitTransactionCount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Calculate and return total amount based on transaction type
 * @param salesHeaderId
 * @param transactionType
 * @returns
 */
const calculateTotalAmount = async (
  expensesHeaderId: string,
  transactionType: 'credit' | 'debit',
): Promise<number> => {
  try {
    let transactionModel: any;

    if (transactionType === 'credit') {
      transactionModel = ExpensesCreditTransaction;
    } else {
      transactionModel = ExpensesDebitTransaction;
    }

    const totalAmount = await transactionModel.sum('amount', {
      where: { expensesHeaderId },
    });

    return totalAmount ?? 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createExpensesCreditTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const creditTransaction = {
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    // Check line item 1 debit transaction is exist
    if (!(await checkLineItemOneExist(req.body.expensesHeaderId))) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.LINE_ITEM_ONE_TRANSACTION_NOT_FOUND,
        null,
      );
      return res.status(400).send(response);
    }

    if (req.body.expensesCreditTransactionId) {
      Object.assign(creditTransaction, {
        id: req.body.expensesCreditTransactionId,
      });
    }
    await ExpensesCreditTransaction.upsert(creditTransaction);
    const expensesCreditTransactions = await ExpensesCreditTransaction.findAll({
      where: {
        expensesHeaderId: req.body.expensesHeaderId,
      },
      include: [
        {
          model: Vendor,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: TaxCode,
        },
        {
          model: BusinessPlace,
        },
        {
          model: SectionCode,
        },
        {
          model: WithholdingTax,
        },
      ],
      raw: true,
      nest: true,
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      expensesCreditTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    console.log('err=> ', err);
    next(err);
  }
};

interface UpdateExpensesHeaderArgs {
  newDocumentStatus: 'Updated' | 'Updated Reversed';
  oldDocumentStatus: 'Saved' | 'Updated';
  expensesHeaderId: string;
  reversalId?: string;
}

const updateExpensesHeader = ({
  newDocumentStatus,
  oldDocumentStatus,
  expensesHeaderId,
  reversalId,
}: UpdateExpensesHeaderArgs) =>
  ExpensesHeader.update(
    { documentStatus: newDocumentStatus, reversalId },
    { where: { id: expensesHeaderId, documentStatus: oldDocumentStatus } },
  );

const getExpensesHeaderData = (expensesHeaderId: string) =>
  ExpensesHeader.findOne({
    where: { id: expensesHeaderId },
    raw: true,
  });

const updateDocumentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { expensesHeaderId } = req.body;

    if (!expensesHeaderId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    // Check debit equal to credit transaction
    const totalDebitAmount = await calculateTotalAmount(
      expensesHeaderId,
      'debit',
    );
    const totalCreditAmount = await calculateTotalAmount(
      expensesHeaderId,
      'credit',
    );
    if (totalDebitAmount !== totalCreditAmount) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.CREDIT_DEBIT_AMOUNT_EQUALITY,
        null,
      );
      return res.status(400).send(response);
    }

    const [updateStatus] = await updateExpensesHeader({
      newDocumentStatus: 'Updated',
      oldDocumentStatus: 'Saved',
      expensesHeaderId,
    });

    if (!updateStatus) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.ALLOWED_UPDATE_FOR_SAVED_STATUS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const expensesHeaderData = await getExpensesHeaderData(expensesHeaderId);

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.DOCUMENT_LOCKED,
      expensesHeaderData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const validateRequestBody = (
  debitTransactionIds: string[],
  creditTransactionIds: string[],
  salesHeaderId: string,
) =>
  Array.isArray(debitTransactionIds) &&
  debitTransactionIds.length &&
  Array.isArray(creditTransactionIds) &&
  creditTransactionIds.length &&
  salesHeaderId;

const createOneTimeCustomer = async (
  userId: string,
  reversedSalesHeaderId: string,
  salesHeaderId: string,
) => {
  const oneTimeCustomerData = await OneTimeCustomer.findOne({
    where: { salesHeaderId },
    raw: true,
  });

  if (oneTimeCustomerData) {
    const newOneTimeCustomerData = {
      ...oneTimeCustomerData,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      salesHeaderId: reversedSalesHeaderId,
      createdBy: userId,
      updatedBy: userId,
    } as unknown as OneTimeCustomerModel;

    return OneTimeCustomer.create(newOneTimeCustomerData);
  }
};

const transactionReverse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { debitTransactionIds, creditTransactionIds, expensesHeaderId } =
      req.body;

    if (
      !validateRequestBody(
        debitTransactionIds,
        creditTransactionIds,
        expensesHeaderId,
      )
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const expensesHeader = await ExpensesHeader.findOne({
      where: { id: expensesHeaderId, documentStatus: 'Updated' },
      raw: true,
    });

    if (!expensesHeader) {
      const response = responseFormatter(
        CODE[401],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const reverseExpensesHeader = {
      ...expensesHeader,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      documentStatus: 'Updated Reversed',
    } as unknown as ExpensesHeaderModel;

    const reversedExpensesHeader = await ExpensesHeader.create(
      reverseExpensesHeader,
    );

    // Debit Transaction Reversal
    const debitTransactions = await Promise.all(
      debitTransactionIds.map(async (debitTransactionId: string) => {
        const expensesDebitTransaction = await ExpensesDebitTransaction.findOne(
          {
            where: { id: debitTransactionId },
          },
        );
        const postingKeyData = await PostingKey.findOne({
          where: { id: expensesDebitTransaction?.postingKeyId },
        });
        return {
          expensesHeaderId: reversedExpensesHeader?.id,
          businessTransactionId:
            expensesDebitTransaction?.businessTransactionId,
          glAccountId: expensesDebitTransaction?.glAccountId,
          specialGlIndicatorId: expensesDebitTransaction?.specialGlIndicatorId,
          description: expensesDebitTransaction?.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: expensesDebitTransaction?.amount,
          taxCodeId: expensesDebitTransaction?.taxCodeId,
          businessPlaceId: expensesDebitTransaction?.businessPlaceId,
          costCentreId: expensesDebitTransaction?.costCentreId,
          profitCentreId: expensesDebitTransaction?.profitCentreId,
          assignment: expensesDebitTransaction?.assignment,
          text: expensesDebitTransaction?.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
    await ExpensesDebitTransaction.bulkCreate(debitTransactions);

    // Credit Transaction Reversal
    const creditTransactions = await Promise.all(
      creditTransactionIds.map(async (creditTransactionId: string) => {
        const expensesCreditTransaction =
          await ExpensesCreditTransaction.findOne({
            where: { id: creditTransactionId },
          });
        const postingKeyData = await PostingKey.findOne({
          where: { id: expensesCreditTransaction?.postingKeyId },
        });
        return {
          expensesHeaderId: reversedExpensesHeader?.id,
          vendorId: expensesCreditTransaction?.vendorId,
          description: expensesCreditTransaction?.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: expensesCreditTransaction?.amount,
          specialGlIndicatorId: expensesCreditTransaction?.specialGlIndicatorId,
          taxCodeId: expensesCreditTransaction?.taxCodeId,
          businessPlaceId: expensesCreditTransaction?.businessPlaceId,
          sectionCodeId: expensesCreditTransaction?.sectionCodeId,
          withholdingTaxId: expensesCreditTransaction?.withholdingTaxId,
          paymentTerms: expensesCreditTransaction?.paymentTerms,
          assignment: expensesCreditTransaction?.assignment,
          text: expensesCreditTransaction?.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
    await ExpensesCreditTransaction.bulkCreate(creditTransactions);

    await updateExpensesHeader({
      newDocumentStatus: 'Updated Reversed',
      oldDocumentStatus: 'Updated',
      expensesHeaderId,
      reversalId: reversedExpensesHeader?.id,
    });

    const expensesHeaderData = await getExpensesHeaderData(expensesHeaderId);

    let newExpensesHeaderData = expensesHeaderData;

    if (
      expensesHeaderData &&
      expensesHeaderData.documentStatus === 'Updated Reversed' &&
      expensesHeaderData.reversalId === null
    ) {
      const reversalDocument = (await ExpensesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: expensesHeaderData.id },
        raw: true,
      })) as ExpensesHeaderModel;
      newExpensesHeaderData = {
        ...expensesHeaderData,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as ExpensesHeaderWithDocumentLabel;
    } else if (
      expensesHeaderData &&
      expensesHeaderData.documentStatus === 'Updated Reversed' &&
      expensesHeaderData.reversalId !== null
    ) {
      newExpensesHeaderData = {
        ...expensesHeaderData,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as ExpensesHeaderWithDocumentLabel;
    }

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.TRANSACTION_REVERSED,
      newExpensesHeaderData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteLineItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionId, transactionType } = req.body;

    if (!transactionId || !transactionType) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    let transactionModel: any;

    if (transactionType === 'credit') {
      transactionModel = ExpensesCreditTransaction;
    } else {
      transactionModel = ExpensesDebitTransaction;
    }
    console.log('tt+> ', transactionId);
    const transactionData = await transactionModel.findOne({
      where: { id: transactionId },
      raw: true,
    });
    if (!transactionData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_ID_NOT_FOUND,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const expensesHeaderData = await ExpensesHeader.findOne({
      where: { id: transactionData?.expensesHeaderId, documentStatus: 'Saved' },
    });
    if (!expensesHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.ALLOWED_DELETION_FOR_SAVED_STATUS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    await transactionModel.destroy({ where: { id: transactionId } });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.LINE_ITEM_DELETED,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const findByDocumentNumber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { documentNumber } = req.params;

    const expensesHeaderFromDocumentNumber = await ExpensesHeader.findOne({
      where: { id: documentNumber },
      raw: true,
    });

    if (!expensesHeaderFromDocumentNumber) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.INVALID_DOCUMENT_NUMBER,
        null,
      );
      return res.status(400).send(response);
    }

    let newExpensesHeaderFromDocumentNumber = expensesHeaderFromDocumentNumber;

    if (
      expensesHeaderFromDocumentNumber &&
      expensesHeaderFromDocumentNumber.documentStatus === 'Updated Reversed' &&
      expensesHeaderFromDocumentNumber.reversalId === null
    ) {
      const reversalDocument = (await ExpensesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: expensesHeaderFromDocumentNumber.id },
        raw: true,
      })) as ExpensesHeaderModel;
      newExpensesHeaderFromDocumentNumber = {
        ...expensesHeaderFromDocumentNumber,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as ExpensesHeaderWithDocumentLabel;
    } else if (
      expensesHeaderFromDocumentNumber &&
      expensesHeaderFromDocumentNumber.documentStatus === 'Updated Reversed' &&
      expensesHeaderFromDocumentNumber.reversalId !== null
    ) {
      newExpensesHeaderFromDocumentNumber = {
        ...expensesHeaderFromDocumentNumber,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as ExpensesHeaderWithDocumentLabel;
    }

    const debitTransactionData = await ExpensesDebitTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderFromDocumentNumber.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: BusinessPlace,
        },
        {
          model: TaxCode,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    });

    const creditTransactionData = await ExpensesCreditTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderFromDocumentNumber.id },
      include: [
        {
          model: Vendor,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: TaxCode,
        },
        {
          model: BusinessPlace,
        },
        {
          model: SectionCode,
        },
        {
          model: WithholdingTax,
        },
      ],
      raw: true,
      nest: true,
    });

    const data = {
      expensesHeaderData: newExpensesHeaderFromDocumentNumber,
      debitTransactionData,
      creditTransactionData,
    };
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      data,
    );
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getLastDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expensesHeaderFromPlantId = await ExpensesHeader.findOne({
      where: { plantId: req.session.activePlantId },
      order: [['createdAt', 'desc']],
      raw: true,
    });
    if (!expensesHeaderFromPlantId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_NOT_FOUND,
        null,
      );
      return res.status(400).send(response);
    }

    let newExpensesHeaderFromPlantId = expensesHeaderFromPlantId;

    if (
      expensesHeaderFromPlantId &&
      expensesHeaderFromPlantId.documentStatus === 'Updated Reversed' &&
      expensesHeaderFromPlantId.reversalId === null
    ) {
      const reversalDocument = (await ExpensesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: expensesHeaderFromPlantId.id },
        raw: true,
      })) as ExpensesHeaderModel;
      newExpensesHeaderFromPlantId = {
        ...expensesHeaderFromPlantId,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as ExpensesHeaderWithDocumentLabel;
    } else if (
      expensesHeaderFromPlantId &&
      expensesHeaderFromPlantId.documentStatus === 'Updated Reversed' &&
      expensesHeaderFromPlantId.reversalId !== null
    ) {
      newExpensesHeaderFromPlantId = {
        ...expensesHeaderFromPlantId,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as ExpensesHeaderWithDocumentLabel;
    }

    const debitTransactionData = await ExpensesDebitTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderFromPlantId.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: BusinessPlace,
        },
        {
          model: TaxCode,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    });

    const creditTransactionData = await ExpensesCreditTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderFromPlantId.id },
      include: [
        {
          model: Vendor,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: TaxCode,
        },
        {
          model: BusinessPlace,
        },
        {
          model: SectionCode,
        },
        {
          model: WithholdingTax,
        },
      ],
      raw: true,
      nest: true,
    });

    const data = {
      expensesHeaderData: newExpensesHeaderFromPlantId,
      debitTransactionData,
      creditTransactionData,
    };
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      data,
    );
    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const exportExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { expensesHeaderId } = req.body;
    if (!expensesHeaderId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    const expensesHeaderData = await ExpensesHeader.findOne({
      where: { id: expensesHeaderId, documentStatus: 'Updated' },
      raw: true,
    });
    if (!expensesHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_EXPORT_ALLOWED,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    const debitTransactionData = (await ExpensesDebitTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderData.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: BusinessPlace,
        },
        {
          model: TaxCode,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    })) as ExpensesDebitTransactionModelWithIncludes[];

    const creditTransactionData = (await ExpensesCreditTransaction.findAll({
      where: { expensesHeaderId: expensesHeaderData.id },
      include: [
        {
          model: Vendor,
        },
        {
          model: PostingKey,
        },
        {
          model: SpecialGlIndicator,
        },
        {
          model: TaxCode,
        },
        {
          model: BusinessPlace,
        },
        {
          model: SectionCode,
        },
        {
          model: WithholdingTax,
        },
      ],
      raw: true,
      nest: true,
    })) as ExpensesCreditTransactionModelWithIncludes[];
    const expensesData = [
      {
        documentDate: dateFormat(expensesHeaderData.documentDate, '.', false),
        companyCode: expensesHeaderData.companyCode,
        postingDate: dateFormat(expensesHeaderData.postingDate, '.', false),
        currency: expensesHeaderData.currency,
        reference: expensesHeaderData.reference,
        documentHeaderText: expensesHeaderData.documentHeaderText,

        postingKeyDr: debitTransactionData[0]?.posting_key?.postingKey,
        glAccount: debitTransactionData[0]?.gl_account?.glAccounts,
        amountDR: debitTransactionData[0].amount,
        taxCode: debitTransactionData[0]?.tax_code?.taxCode,
        businessPlaceDr:
          debitTransactionData[0]?.business_place?.businessPlaceCode,
        costCentre: debitTransactionData[0]?.cost_centre?.costCentre,
        assignment: debitTransactionData[0]?.assignment,
        textDr: debitTransactionData[0]?.text,

        postingKeyCr: creditTransactionData[0]?.posting_key?.postingKey,
        venderNo: creditTransactionData[0]?.vendor?.vendorNo,
        amountCr: creditTransactionData[0]?.amount,
        businessPlaceCr:
          creditTransactionData[0]?.business_place?.businessPlaceCode,
        section: creditTransactionData[0]?.section_code?.sectionCode,
        textCr: creditTransactionData[0].text,
      },
    ];
    const heading = [
      [
        'Document Date',
        'COM CODE',
        'POST DATE',
        'CURRENCY',
        'REFERENCE',
        'DOC HEADER TEXT',

        'PST KEY',
        'GL ACCOUNT',
        'AMOUNT',
        'TAX CODE',
        'BUSINESS AREA',
        'COST CENTER',
        'ASSIGNMENT',
        'TEXT',

        'POST KEY',
        'ACC NO',
        'AMOUNT',
        'BUS AREA',
        'SECTION',
        'TEXT',
      ],
    ];
    // Had to create a new workbook and then add the header
    const workbook = xlsx.utils.book_new();
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_aoa(worksheet, heading);
    // Starting in the second row to avoid overriding and skipping headers
    xlsx.utils.sheet_add_json(worksheet, expensesData, {
      origin: 'A2',
      skipHeader: true,
    });
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // send workbook as a download
    const buffer = xlsx.write(workbook, { type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { expensesHeaderId } = req.body;

    if (!expensesHeaderId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const expensesHeaderData = await ExpensesHeader.findOne({
      where: { id: expensesHeaderId, documentStatus: 'Saved' },
    });
    if (!expensesHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.ALLOWED_DELETION_FOR_SAVED_STATUS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    await ExpensesDebitTransaction.destroy({ where: { expensesHeaderId } });
    await ExpensesCreditTransaction.destroy({ where: { expensesHeaderId } });
    await ExpensesHeader.destroy({ where: { id: expensesHeaderId } });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.DOCUMENT_DELETED_SINGLE,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default {
  createExpensesHeader,
  createExpensesDebitTransaction,
  createExpensesCreditTransaction,
  updateDocumentStatus,
  transactionReverse,
  deleteLineItem,
  findByDocumentNumber,
  getLastDocument,
  exportExpenses,
  deleteDocument,
};
