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
      Object.assign(creditTransaction, { id: req.body.salesCreditTransactionId });
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

export default {
  createSalesHeader,
  createSalesDebitTransaction,
  createSalesCreditTransaction,
};
