import { NextFunction, Request, Response } from 'express';
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
    console.log('test=> ', debitTransactions);
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

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default {
  createSalesHeader,
  createSalesDebitTransaction,
  createSalesCreditTransaction,
  transactionReverse,
};
