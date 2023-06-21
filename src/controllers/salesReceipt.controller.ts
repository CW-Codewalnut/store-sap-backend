import { NextFunction, Request, Response } from 'express';
import { BigNumber } from 'bignumber.js';
import { Op } from 'sequelize';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import SalesHeader from '../models/sales-header';
import SalesDebitTransaction from '../models/sales-debit-transaction';
import SalesCreditTransaction from '../models/sales-credit-transaction';
import CashLedger from '../models/cash-ledger';
import BusinessTransaction from '../models/business-transaction';
import GlAccount from '../models/gl-account';
import Customer from '../models/customer';
import PostingKey from '../models/posting-key';
import PosMidList from '../models/pos-mid-list';
import ProfitCentre from '../models/profit-centre';
import Plant from '../models/plant';
import Preference from '../models/preference';
import { UpdateSalesHeaderArgs } from '../interfaces/salesReceipt/saleReceipt.interface';
import OneTimeCustomer from '../models/one-time-customer';

const createSalesHeader = async (
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

    const cashLedger = await CashLedger.findOne({
      where: { plantId: req.session.activePlantId },
    });

    if (!cashLedger) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.CASH_LEDGER_REQUIRED,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const headerBody = {
      ...req.body,
      plantId: req.session.activePlantId,
      cashLedgerId: cashLedger.id,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (req.body.salesHeaderId) {
      Object.assign(headerBody, { id: req.body.salesHeaderId });
    }

    const [salesHeader] = await SalesHeader.upsert(headerBody);

    const salesHeaderData = await SalesHeader.findOne({
      where: {
        id: salesHeader.id,
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
      salesHeaderData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const createSalesDebitTransaction = async (
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

    if (req.body.salesDebitTransactionId) {
      Object.assign(debitTransaction, { id: req.body.salesDebitTransactionId });
    }

    await SalesDebitTransaction.upsert(debitTransaction);
    const salesDebitTransactions = await SalesDebitTransaction.findAll({
      where: {
        salesHeaderId: req.body.salesHeaderId,
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
          model: ProfitCentre,
        },
      ],
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      salesDebitTransactions,
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
 * @param salesHeaderId
 * @returns
 */
const checkLineItemOneExist = async (
  salesHeaderId: string,
): Promise<number> => {
  try {
    const debitTransactionCount = await SalesDebitTransaction.count({
      where: {
        salesHeaderId,
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
  salesHeaderId: string,
  transactionType: 'credit' | 'debit',
): Promise<number> => {
  try {
    let transactionModel: any;

    if (transactionType === 'credit') {
      transactionModel = SalesCreditTransaction;
    } else {
      transactionModel = SalesDebitTransaction;
    }

    const totalAmount = await transactionModel.sum('amount', {
      where: { salesHeaderId },
    });

    return totalAmount ?? 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createSalesCreditTransaction = async (
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
    if (!(await checkLineItemOneExist(req.body.salesHeaderId))) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.LINE_ITEM_ONE_TRANSACTION_NOT_FOUND,
        null,
      );
      return res.status(400).send(response);
    }

    if (req.body.paymentMethod.toLowerCase() === 'cash') {
      const sumOfAmount = await getSumOfAmountForCash(req.body.salesHeaderId);

      const amount = new BigNumber(req.body.amount).toNumber();
      const totalAmount = sumOfAmount + amount;
      if (!(await checkValidAmount(totalAmount))) {
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.SALES_RECEIPT_CASH_LIMIT,
          null,
        );
        return res.status(400).send(response);
      }
    }

    if (req.body.salesCreditTransactionId) {
      Object.assign(creditTransaction, {
        id: req.body.salesCreditTransactionId,
      });
    }

    await SalesCreditTransaction.upsert(creditTransaction);
    const salesCreditTransactions = await SalesCreditTransaction.findAll({
      where: {
        salesHeaderId: req.body.salesHeaderId,
      },
      include: [
        {
          model: Customer,
        },
        {
          model: PostingKey,
        },
        {
          model: PosMidList,
        },
      ],
    });

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      salesCreditTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const updateSalesHeader = ({
  newDocumentStatus,
  oldDocumentStatus,
  salesHeaderId,
}: UpdateSalesHeaderArgs) =>
  SalesHeader.update(
    { documentStatus: newDocumentStatus },
    { where: { id: salesHeaderId, documentStatus: oldDocumentStatus } },
  );

const getSaleHeaderData = (salesHeaderId: string) =>
  SalesHeader.findOne({
    where: { id: salesHeaderId },
  });

const updateDocumentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { salesHeaderId } = req.body;

    if (!salesHeaderId) {
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
      req.body.salesHeaderId,
      'debit',
    );
    const totalCreditAmount = await calculateTotalAmount(
      req.body.salesHeaderId,
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

    const [updateStatus] = await updateSalesHeader({
      newDocumentStatus: 'Updated',
      oldDocumentStatus: 'Saved',
      salesHeaderId,
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

    const salesHeaderData = await getSaleHeaderData(salesHeaderId);

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.DOCUMENT_LOCKED,
      salesHeaderData,
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

const transactionReverse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { debitTransactionIds, creditTransactionIds, salesHeaderId } =
      req.body;

    if (
      !validateRequestBody(
        debitTransactionIds,
        creditTransactionIds,
        salesHeaderId,
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

    const saleHeader = await SalesHeader.findOne({
      where: { id: salesHeaderId, documentStatus: 'Updated' },
    });

    if (!saleHeader) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    // Debit Transaction Reversal
    const debitTransactions = await Promise.all(
      debitTransactionIds.map(async (debitTransactionId: string) => {
        const salesDebitTransaction = await SalesDebitTransaction.findOne({
          where: { id: debitTransactionId },
        });
        const postingKeyData = await PostingKey.findOne({
          where: { id: salesDebitTransaction?.postingKeyId },
        });
        return {
          salesHeaderId: salesDebitTransaction?.salesHeaderId,
          businessTransactionId: salesDebitTransaction?.businessTransactionId,
          glAccountId: salesDebitTransaction?.glAccountId,
          description: salesDebitTransaction?.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: salesDebitTransaction?.amount,
          profitCentreId: salesDebitTransaction?.profitCentreId,
          assignment: salesDebitTransaction?.assignment,
          text: salesDebitTransaction?.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
    await SalesDebitTransaction.bulkCreate(debitTransactions);

    // Credit Transaction Reversal
    const creditTransactions = await Promise.all(
      creditTransactionIds.map(async (creditTransactionId: string) => {
        const salesCreditTransaction = await SalesCreditTransaction.findOne({
          where: { id: creditTransactionId },
        });
        const postingKeyData = await PostingKey.findOne({
          where: { id: salesCreditTransaction?.postingKeyId },
        });
        return {
          salesHeaderId: salesCreditTransaction?.salesHeaderId,
          customerId: salesCreditTransaction?.customerId,
          description: salesCreditTransaction?.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: salesCreditTransaction?.amount,
          baselineDate: salesCreditTransaction?.baselineDate,
          paymentMethod: salesCreditTransaction?.paymentMethod,
          cardType: salesCreditTransaction?.cardType,
          cardSubType: salesCreditTransaction?.cardSubType,
          posMidId: salesCreditTransaction?.posMidId,
          remitterName: salesCreditTransaction?.remitterName,
          RemitterContactNumber: salesCreditTransaction?.RemitterContactNumber,
          UpiDetails: salesCreditTransaction?.UpiDetails,
          qrCode: salesCreditTransaction?.qrCode,
          rtgsOrNeftDetails: salesCreditTransaction?.rtgsOrNeftDetails,
          customerBankName: salesCreditTransaction?.customerBankName,
          assignment: salesCreditTransaction?.assignment,
          text: salesCreditTransaction?.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
    await SalesCreditTransaction.bulkCreate(creditTransactions);

    await updateSalesHeader({
      newDocumentStatus: 'Updated Reversed',
      oldDocumentStatus: 'Updated',
      salesHeaderId,
    });

    const salesHeaderData = await getSaleHeaderData(salesHeaderId);
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      salesHeaderData,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteTransactions = async (
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
      transactionModel = SalesCreditTransaction;
    } else {
      transactionModel = SalesDebitTransaction;
    }

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

    const saleHeaderData = await SalesHeader.findOne({
      where: { id: transactionData?.salesHeaderId, documentStatus: 'Saved' },
    });
    if (!saleHeaderData) {
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
      MESSAGE.TRANSACTION_DELETED,
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

    const saleHeaderData: any = await SalesHeader.findOne({
      where: { id: documentNumber },
    });

    if (!saleHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.INVALID_DOCUMENT_NUMBER,
        null,
      );
      return res.status(400).send(response);
    }

    const debitTransactionData = await SalesDebitTransaction.findAll({
      where: { salesHeaderId: saleHeaderData.id },
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
          model: ProfitCentre,
        },
      ],
    });

    const creditTransactionData = await SalesCreditTransaction.findAll({
      where: { salesHeaderId: saleHeaderData.id },
      include: [
        {
          model: Customer,
        },
        {
          model: PostingKey,
        },
        {
          model: PosMidList,
        },
      ],
    });

    const oneTimeCustomerData = await OneTimeCustomer.findOne({
      where: { salesHeaderId: saleHeaderData.id },
    });

    const data = {
      saleHeaderData,
      debitTransactionData,
      creditTransactionData,
      oneTimeCustomerData,
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

export default {
  createSalesHeader,
  createSalesDebitTransaction,
  createSalesCreditTransaction,
  updateDocumentStatus,
  transactionReverse,
  deleteTransactions,
  findByDocumentNumber,
};
