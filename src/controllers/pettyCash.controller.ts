import { NextFunction, Request, Response } from 'express';
import sequelize, { Op } from 'sequelize';
import * as xlsx from 'xlsx';
import { BigNumber } from 'bignumber.js';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import PettyCash from '../models/petty-cash';
import BusinessTransaction from '../models/business-transaction';
import TaxCode from '../models/tax-code';
import GlAccount from '../models/gl-account';
import BankAccount from '../models/bank-account';
import Vendor from '../models/vendor';
import Customer from '../models/customer';
import Plant from '../models/plant';
import CostCentre from '../models/cost-centre';
import ProfitCentre from '../models/profit-centre';
import Segment from '../models/segment';
import Employee from '../models/employee';
import HouseBank from '../models/house-bank';
import {
  dateFormat,
  convertFromDate,
  convertToDate,
  isNumber,
} from '../utils/helper';
import MESSAGE from '../config/message.json';
import Preference from '../models/preference';
import CashDenomination from '../models/cash-denomination';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: {
        amount,
        cashJournalId,
        fromDate,
        toDate,
        pettyCashType,
        taxCodeId,
        taxRate,
        netAmount,
        taxBaseAmount,
        postingDate,
        documentDate,
        referenceDate,
      },
      session,
      user,
    } = req;

    if (
      !isNumber(amount)
      || !isNumber(netAmount)
      || !isNumber(taxBaseAmount)
      || !cashJournalId
      || !fromDate
      || !toDate
      || !pettyCashType
      || !taxCodeId
      || !session.activePlantId
      || !isNumber(taxRate)
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(400).send(response);
    }

    if (!session.isAllowedNewTransaction) {
      const today = dateFormat(new Date(), '-');
      const foundPrevDaySavedTransaction = await checkDocumentStatusSavedExist(
        cashJournalId,
        today,
        req,
      );

      if (foundPrevDaySavedTransaction) {
        session.isAllowedNewTransaction = false;
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.NEW_TRANSACTION_NOT_ALLOWED,
          null,
        );
        return res.status(400).send(response);
      }

      session.isAllowedNewTransaction = true;
    }

    if (pettyCashType === 'Payment') {
      const closingBalance = await getClosingBalance(req);
      const totalSavedAmount = await getTotalSavedAmount(
        cashJournalId,
        session,
      );
      const totalAmount = +new BigNumber(amount).plus(totalSavedAmount);

      if (closingBalance !== undefined && closingBalance < totalAmount) {
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.AMOUNT_EXCEEDING_CLOSING_BAL,
          null,
        );
        return res.status(400).send(response);
      }
    }

    if (!(await checkTaxCode(taxCodeId, taxRate))) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TAX_CODE_INVALID,
        null,
      );
      return res.status(400).send(response);
    }

    if (!(await checkValidAmount(amount))) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.PETTY_CASH_LIMIT,
        null,
      );
      return res.status(400).send(response);
    }

    const { postingISODate, documentISODate, referenceISODate } = convertDatesIntoIso({ postingDate, documentDate, referenceDate });

    const pettyCashBody = {
      ...req.body,
      postingDate: postingISODate,
      documentDate: documentISODate,
      referenceDate: referenceISODate,
      createdBy: user.id,
      updatedBy: user.id,
      plantId: session.activePlantId,
    };

    const createdPettyCash = await PettyCash.create(pettyCashBody);

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.DOCUMENT_SAVED,
      createdPettyCash,
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

/**
 * It calculates the total amount of Saved transactions and returns the resulting sum.
 * @param pettyCashBody
 * @param req
 * @returns
 */
const getTotalSavedAmount = async (
  cashJournalId: string,
  session: any,
): Promise<number> => {
  try {
    const { activePlantId } = session;

    const totalSavedAmount = await PettyCash.sum('amount', {
      where: {
        [Op.and]: [
          { pettyCashType: { [Op.eq]: 'Payment' } },
          { plantId: activePlantId },
          { cashJournalId },
          { documentStatus: { [Op.eq]: 'Saved' } },
        ],
      },
    });

    return totalSavedAmount ?? 0;
  } catch (err) {
    throw err;
  }
};

/**
 * It returns true if a saved transaction from the previous day is found; otherwise, it returns false.
 * @param cashJournalId
 * @param today
 * @param req
 * @returns
 */
const checkDocumentStatusSavedExist = async (
  cashJournalId: string,
  today: string,
  req: Request,
): Promise<boolean> => {
  try {
    const { activePlantId } = req.session;

    const query = [
      sequelize.where(
        sequelize.fn('FORMAT', sequelize.col('createdAt'), 'dd-MM-yyyy'),
        {
          [Op.lt]: today,
        },
      ),
      { documentStatus: 'Saved' },
      { plantId: activePlantId },
      { cashJournalId },
    ];

    const doesPrevDaySavedDocumentExist = await PettyCash.findOne({
      where: {
        [Op.and]: query,
      },
      raw: true,
    });

    return !!doesPrevDaySavedDocumentExist;
  } catch (err) {
    throw err;
  }
};

/**
 * This function checks that the tax code must be 'V0'.
 * @param taxCodeId
 * @param taxRate
 * @returns
 */
const checkTaxCode = async (
  taxCodeId: string,
  taxRate: number,
): Promise<boolean> => {
  try {
    const isTaxCodeExist = await TaxCode.findOne({
      where: { id: taxCodeId, taxCode: 'V0' },
    });

    return !!isTaxCodeExist && taxRate === 0;
  } catch (err) {
    throw err;
  }
};

/**
 * This function returns false if the provided amount exceeds the specified limit; otherwise, it returns true.
 * @param amount
 * @returns
 */
const checkValidAmount = async (amount: number): Promise<boolean> => {
  try {
    const isValidAmount = await Preference.findOne({
      where: {
        [Op.and]: [{ name: 'pettyCashStoreLimit' }, { value: { [Op.gte]: amount } }],
      },
      raw: true,
    });
    return !!isValidAmount;
  } catch (err) {
    throw err;
  }
};

/**
 * This function converts date values into ISO-formatted date strings.
 * @param pettyCashBody
 * @returns
 */
const convertDatesIntoIso = ({
  postingDate,
  documentDate,
  referenceDate,
}: any): any => ({
  postingISODate: new Date(postingDate).toISOString(),
  documentISODate: new Date(documentDate).toISOString(),
  referenceISODate: referenceDate
    ? new Date(referenceDate).toISOString()
    : null,
});

const getPettyCashData = (
  req: Request,
  next: NextFunction,
  pettyCashType: 'Payment' | 'Receipt',
) => {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const { search } = req.query;
    const offset = page * pageSize - pageSize;
    const limit = pageSize;
    const { fromDate, toDate, cashJournalId } = req.body;
    const query = [];

    if (fromDate && toDate) {
      const from = convertFromDate(fromDate);
      const to = convertToDate(toDate);
      const dateBy = { createdAt: { [Op.between]: [from, to] } };
      query.push(dateBy);
    }

    if (search) {
      const condition = {
        [Op.or]: {
          refDocNo: { [Op.like]: `%${search}%` },
        },
      };
      query.push(condition);
    }

    query.push({ pettyCashType });
    query.push({ plantId: req.session.activePlantId });
    query.push({ cashJournalId });

    return PettyCash.findAndCountAll({
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: TaxCode,
        },
        {
          model: GlAccount,
        },
        {
          model: BankAccount,
          include: [
            {
              model: HouseBank,
            },
          ],
        },
        {
          model: Vendor,
        },
        {
          model: Customer,
        },
        {
          model: Plant,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
        {
          model: Segment,
        },
        {
          model: Employee,
        },
      ],
      where: { [Op.and]: query },
      order: [['createdAt', 'ASC']],
      offset,
      limit,
    });
  } catch (err) {
    next(err);
  }
};

const findPaymentsWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !req.body
      || !req.query
      || !req.query.page
      || !req.query.pageSize
      || !req.body.cashJournalId
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      res.status(400).send(response);
    }

    const cashPayment = await getPettyCashData(req, next, 'Payment');

    const today = dateFormat(new Date(), '-');
    const foundPrevDaySavedTransaction = await checkDocumentStatusSavedExist(
      req.body.cashJournalId,
      today,
      req,
    );

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      {
        ...cashPayment,
        foundPrevDaySavedTransaction,
      },
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const findReceiptsWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !req.body
      || !req.query
      || !req.query.page
      || !req.query.pageSize
      || !req.body.cashJournalId
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      res.status(400).send(response);
    }

    const cashReceipt = await getPettyCashData(req, next, 'Receipt');

    const today = dateFormat(new Date(), '-');
    const foundPrevDaySavedTransaction = await checkDocumentStatusSavedExist(
      req.body.cashJournalId,
      today,
      req,
    );

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      {
        ...cashReceipt,
        foundPrevDaySavedTransaction,
      },
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

/**
 * This method will update the transaction form data.
 * @param req
 * @param res
 * @param next
 * @returns
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId } = req.params;

    const {
      body: {
        amount,
        cashJournalId,
        fromDate,
        toDate,
        pettyCashType,
        taxCodeId,
        taxRate,
        netAmount,
        taxBaseAmount,
        postingDate,
        documentDate,
        referenceDate,
        assignment,
        text,
        refDocNo,
      },
      session,
      user,
    } = req;

    const allowedKeys = ['assignment', 'text', 'refDocNo'];
    const isAllowedKeysExist = objectIncludesKeys(req.body, allowedKeys);

    if (
      !isNumber(amount)
      || !isNumber(netAmount)
      || !isNumber(taxBaseAmount)
      || !cashJournalId
      || !fromDate
      || !toDate
      || !pettyCashType
      || !taxCodeId
      || !session.activePlantId
      || !isNumber(taxRate)
      || !isAllowedKeysExist
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(400).send(response);
    }

    const transactionData = await PettyCash.findByPk(transactionId);

    if (transactionData && transactionData.documentStatus === 'Updated') {
      const allowedUpdatedData = {
        assignment,
        text,
        refDocNo,
        updatedBy: req.user.id,
        updateAt: new Date(),
      };

      const response = await updatePettyCash(allowedUpdatedData, transactionId);
      res.status(CODE[200]).send(response);
    } else {
      if (!(await checkTaxCode(taxCodeId, taxRate))) {
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.TAX_CODE_INVALID,
          null,
        );
        return res.status(400).send(response);
      }

      if (!(await checkValidAmount(amount))) {
        const response = responseFormatter(
          CODE[400],
          SUCCESS.FALSE,
          MESSAGE.PETTY_CASH_LIMIT,
          null,
        );
        return res.status(400).send(response);
      }

      const { postingISODate, documentISODate, referenceISODate } = convertDatesIntoIso({ postingDate, documentDate, referenceDate });

      const pettyCashBody = {
        ...req.body,
        postingDate: postingISODate,
        documentDate: documentISODate,
        referenceDate: referenceISODate,
        updateAt: new Date(),
        updatedBy: user.id,
      };

      const response = await updatePettyCash(pettyCashBody, transactionId);
      res.status(CODE[200]).send(response);
    }
  } catch (err) {
    next(err);
  }
};

const objectIncludesKeys = (pettyCashData: any, allowedKeys: Array<string>) => {
  const pettyCashKeys = Object.keys(pettyCashData);
  return allowedKeys.every((allowedKey) => pettyCashKeys.includes(allowedKey));
};

const updatePettyCash = async (pettyCashData: any, transactionId: string) => {
  await PettyCash.update(pettyCashData, {
    where: { id: transactionId },
  });

  const pettyCashResult = await PettyCash.findOne({
    where: { id: transactionId },
  });

  return responseFormatter(
    CODE[200],
    SUCCESS.TRUE,
    MESSAGE.DOCUMENT_UPDATED,
    pettyCashResult,
  );
};

/**
 * This method will updated the document status based on use cases.
 * @param req
 * @param res
 * @param next
 * @returns
 */
const updateDocumentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      transactionIds, documentStatus, cashJournalId, fromDate, toDate,
    } = req.body;

    if (
      !validateRequestBody(
        transactionIds,
        documentStatus,
        cashJournalId,
        fromDate,
        toDate,
        req.body.cashDenomination,
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

    const cashDenominationBody = calculateCashDenomination(req);
    const totalUpdateAmount = await getTotalUpdateAmount(transactionIds);
    const closingBalanceAmount = await getClosingBalance(req);
    const finalClosingBalance = await calculateFinalClosingBalance(
      closingBalanceAmount,
      totalUpdateAmount,
      transactionIds,
    );

    const today = dateFormat(new Date(), '-');
    const previousDayTransactionIds = await getPreviousDayTransactionIds(
      transactionIds,
      today,
    );

    if (
      cashDenominationBody
      && finalClosingBalance === cashDenominationBody.denominationTotalAmount
    ) {
      updateTransactions(
        transactionIds,
        previousDayTransactionIds,
        documentStatus,
      );

      const [cashDenominationData] = await CashDenomination.upsert(
        cashDenominationBody,
      );

      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.DOCUMENT_LOCKED,
        cashDenominationData,
      );
      res.status(CODE[200]).send(response);
    } else {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DENOMINATION_NOT_MATCH,
        null,
      );
      res.status(CODE[400]).send(response);
    }
  } catch (err) {
    throw err;
  }
};

const calculateCashDenomination = (req: Request) => {
  try {
    const {
      denominationId,
      cashJournalId,
      cashDenomination: {
        qty1INR,
        qty2INR,
        qty5INR,
        qty10INR,
        qty20INR,
        qty50INR,
        qty100INR,
        qty200INR,
        qty500INR,
        qty2000INR,
      },
    } = req.body;

    const denominationTotalAmount = qty1INR * 1
      + qty2INR * 2
      + qty5INR * 5
      + qty10INR * 10
      + qty20INR * 20
      + qty50INR * 50
      + qty100INR * 100
      + qty200INR * 200
      + qty500INR * 500
      + qty2000INR * 2000;

    const denominationBody: any = {
      plantId: req.session.activePlantId,
      cashJournalId,
      denominationTotalAmount,
      qty1INR,
      qty2INR,
      qty5INR,
      qty10INR,
      qty20INR,
      qty50INR,
      qty100INR,
      qty200INR,
      qty500INR,
      qty2000INR,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (denominationId) {
      Object.assign(denominationBody, { id: denominationId });
    }
    return denominationBody;
  } catch (err) {
    throw err;
  }
};

const validateRequestBody = (
  transactionIds: string,
  documentStatus: string,
  cashJournalId: string,
  fromDate: any,
  toDate: any,
  cashDenomination: any,
) => Array.isArray(transactionIds)
  && transactionIds.length
  && documentStatus
  && cashJournalId
  && fromDate
  && toDate
  && cashDenomination;

/**
 * This function computes the total amount for a set of transaction IDs provided as input
 * and return the value
 * @param transactionIds
 * @returns
 */
const getTotalUpdateAmount = async (transactionIds: Array<string>) => {
  const totalUpdatingAmount = await PettyCash.sum('amount', {
    where: {
      id: {
        [Op.in]: transactionIds,
      },
    },
  });

  return totalUpdatingAmount ?? 0;
};

/**
 * This function calculate closing balance based on transaction type and
 * return the value
 * @param closingBalanceAmount
 * @param totalUpdateAmount
 * @param transactionIds
 * @returns
 */
const calculateFinalClosingBalance = async (
  closingBalanceAmount: number,
  totalUpdateAmount: number,
  transactionIds: Array<string>,
) => {
  try {
    const pettyCashData = await PettyCash.findOne({
      attributes: ['pettyCashType', 'documentStatus'],
      where: { id: transactionIds[0] },
      raw: true,
    });

    let finalClosingBalance = 0;

    if (
      !pettyCashData
      || closingBalanceAmount == null
      || closingBalanceAmount == undefined
    ) {
      return finalClosingBalance;
    }

    const { pettyCashType, documentStatus } = pettyCashData;
    const isPayment = pettyCashType === 'Payment';
    const isSaved = documentStatus === 'Saved';
    const isUpdated = documentStatus === 'Updated';

    if ((isPayment && isSaved) || (!isPayment && isUpdated)) {
      finalClosingBalance = +new BigNumber(closingBalanceAmount).minus(
        totalUpdateAmount,
      );
    } else if ((isPayment && isUpdated) || (!isPayment && isSaved)) {
      finalClosingBalance = +new BigNumber(closingBalanceAmount).plus(
        totalUpdateAmount,
      );
    }

    return finalClosingBalance;
  } catch (err) {
    throw err;
  }
};

/**
 * This function returns any transactions that occurred on the previous date, if they exist
 * @param transactionIds
 * @param today
 * @returns
 */
const getPreviousDayTransactionIds = async (
  transactionIds: Array<string>,
  today: string,
) => {
  const previousDateSavedTransactions = await PettyCash.findAll({
    attributes: ['id'],
    where: {
      [Op.and]: [
        {
          id: {
            [Op.in]: transactionIds,
          },
        },
        sequelize.where(
          sequelize.fn('FORMAT', sequelize.col('createdAt'), 'dd-MM-yyyy'),
          {
            [Op.lt]: today,
          },
        ),
        { documentStatus: 'Saved' },
      ],
    },
    raw: true,
  });

  return previousDateSavedTransactions.map((transaction) => transaction.id);
};

/**
 * It updates the transaction based on today and previous date transactions
 * @param transactionIds
 * @param previousDayTransactionIds
 * @param documentStatus
 */
const updateTransactions = async (
  transactionIds: Array<string>,
  previousDayTransactionIds: Array<string>,
  documentStatus: string,
) => {
  try {
    transactionIds.forEach(async (transactionId) => {
      let updateData = {};

      if (previousDayTransactionIds.includes(transactionId)) {
        updateData = {
          documentStatus,
          postingDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        updateData = { documentStatus };
      }

      await PettyCash.update(updateData, { where: { id: transactionId } });
    });
  } catch (err) {
    throw err;
  }
};

const deleteTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionIds } = req.body;
    if (!Array.isArray(transactionIds) || !transactionIds.length) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const countMatched = await PettyCash.count({
      where: {
        [Op.and]: [
          { id: { [Op.in]: transactionIds } },
          { documentStatus: { [Op.eq]: 'Saved' } },
        ],
      },
    });
    if (countMatched === 0) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.NO_MATCH_FOUND,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    if (transactionIds.length !== countMatched && countMatched !== 0) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.ALLOWED_DELETION_FOR_SAVED_STATUS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    await PettyCash.destroy({
      where: {
        [Op.and]: [
          { id: { [Op.in]: transactionIds } },
          { documentStatus: { [Op.eq]: 'Saved' } },
        ],
      },
    });

    const transactionSlug = transactionIds.length > 1 ? 'Documents' : 'Document';

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      `${transactionSlug} ${MESSAGE.DOCUMENT_DELETED}`,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const exportPettyCash = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fromDate } = req.body;
    const { toDate } = req.body;
    const startDate = convertFromDate(fromDate);
    const endDate = convertToDate(toDate);

    const checkSavedStatus = await PettyCash.findOne({
      where: {
        [Op.and]: [
          { documentStatus: { [Op.eq]: 'Saved' } },
          { plantId: { [Op.eq]: req.session.activePlantId } },
        ],
      },
    });

    if (checkSavedStatus) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_EXPORT_ERROR,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const pettyCashes = await PettyCash.findAll({
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: TaxCode,
        },
        {
          model: GlAccount,
        },
        {
          model: BankAccount,
          include: [
            {
              model: HouseBank,
            },
          ],
        },
        {
          model: Vendor,
        },
        {
          model: Customer,
        },
        {
          model: Plant,
        },
        {
          model: CostCentre,
        },
        {
          model: ProfitCentre,
        },
        {
          model: Segment,
        },
        {
          model: Employee,
        },
      ],
      where: {
        [Op.and]: [
          { createdAt: { [Op.between]: [startDate, endDate] } },
          { documentStatus: { [Op.eq]: 'Updated' } },
          { plantId: { [Op.eq]: req.session.activePlantId } },
        ],
      },
    });

    const pettyCashData = pettyCashes.map((transaction: any) => ({
      businessTransactionNo:
        transaction.business_transaction.businessTransactionNo,
      amount: transaction.amount,
      glAccounts: transaction.gl_account.glAccounts,
      houseBank: transaction.house_bank ? transaction.house_bank.ifsc : '',
      bankAccount: transaction.bank_account
        ? transaction.bank_account.bankAccountNumber
        : '',
      TaxCode: transaction.taxCodeId ? transaction.tax_code.taxCode : '',
      bpName: transaction.receiptRecipient,
      text: transaction.text ? transaction.text : '',
      venderNo: transaction.vendor ? transaction.vendor.venderNo : '',
      customerNo: transaction.customer ? transaction.customer.customerNo : '',
      postingDate: dateFormat(transaction.postingDate, '.'),
      documentDate: dateFormat(transaction.documentDate, '.'),
      costCentre: transaction.cost_centre
        ? transaction.cost_centre.costCentre
        : '',
      profitCentre: transaction.profit_centre.profitCentre,
      fiscalYear: new Date(transaction.postingDate).getFullYear(),
      cjDocNo: transaction.cjDocNo,
      refDocNo: transaction.refDocNo,
      orderNo: transaction.orderNo,
      profitabilitySegmentNo: transaction.profitabilitySegmentNo,
      assignmentNo: transaction.assignment,
      segment: transaction.segment.segment,
    }));

    const Heading = [
      [
        'Cash Journal Business Transaction',
        'Amount',
        'G/L',
        'Short Key for a House Bank',
        'ID for Account Details',
        'Tax_code',
        'BP_Name',
        'Text',
        'Vendor Number',
        'Customer Number',
        'Posting Date',
        'Document Date',
        'Cost Center',
        'Profit Center',
        'Fiscal Year',
        'Cj_doc_no',
        'Ref_doc_no',
        'Ordernumber',
        'Profitability Segment Number (CO-PA)',
        'Assignment Number',
        'Segment',
      ],
    ];

    // Had to create a new workbook and then add the header
    const workbook = xlsx.utils.book_new();
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_aoa(worksheet, Heading);

    // Starting in the second row to avoid overriding and skipping headers
    xlsx.utils.sheet_add_json(worksheet, pettyCashData, {
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

/**
 * Get balance calculation
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getBalanceCalculation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fromDate, toDate, cashJournalId } = req.body;
    if (!req.body || !fromDate || !toDate) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    if (req.session.activePlantId) {
      const openingBalance = (await getOpeningBalance(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
      )) ?? 0;
      const totalCashReceipts = (await getTotalCashReceipts(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
        toDate,
      )) ?? 0;
      const totalCashPayments = (await getTotalCashPayments(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
        toDate,
      )) ?? 0;
      const closingBalance = +new BigNumber(openingBalance)
        .plus(totalCashReceipts)
        .minus(totalCashPayments)
        .abs();

      const balanceCalculations = {
        openingBalance: new BigNumber(openingBalance).abs().toFixed(2),
        totalCashReceipts: new BigNumber(totalCashReceipts).toFixed(2),
        totalCashPayments: new BigNumber(totalCashPayments).abs().toFixed(2),
        closingBalance: new BigNumber(closingBalance).toFixed(2),
      };

      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.FETCHED,
        balanceCalculations,
      );
      res.status(200).send(response);
    } else {
      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.FETCHED,
        null,
      );
      res.status(200).send(response);
    }
  } catch (err) {
    next(err);
  }
};

const getOpeningBalance = async (
  plantId: string,
  cashJournalId: string,
  fromDate: string,
) => {
  const startDate = convertFromDate(fromDate);
  let totalCashPayment = await PettyCash.sum('amount', {
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.lt]: startDate,
          },
        },
        {
          plantId,
        },
        {
          cashJournalId,
        },
        {
          pettyCashType: {
            [Op.eq]: 'Payment',
          },
        },
        {
          documentStatus: {
            [Op.ne]: 'Saved',
          },
        },
      ],
    },
  });

  let totalCashReceipt = await PettyCash.sum('amount', {
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.lt]: startDate,
          },
        },
        {
          plantId,
        },
        {
          cashJournalId,
        },
        {
          pettyCashType: {
            [Op.eq]: 'Receipt',
          },
        },
        {
          documentStatus: {
            [Op.ne]: 'Saved',
          },
        },
      ],
    },
  });

  totalCashReceipt = totalCashReceipt ?? 0;
  totalCashPayment = totalCashPayment ?? 0;

  const openingBalance = +new BigNumber(totalCashReceipt).minus(
    totalCashPayment,
  );
  return openingBalance;
};

const getTotalCashPayments = (
  plantId: string,
  cashJournalId: string,
  fromDate: string,
  toDate: string,
) => getSumAmount(plantId, cashJournalId, fromDate, toDate, 'Payment');

const getTotalCashReceipts = (
  plantId: string,
  cashJournalId: string,
  fromDate: string,
  toDate: string,
) => getSumAmount(plantId, cashJournalId, fromDate, toDate, 'Receipt');

/**
 *
 * @param plantId
 * @param fromDate
 * @param toDate
 * @param pettyCashType
 * @returns
 */
const getSumAmount = (
  plantId: string,
  cashJournalId: string,
  fromDate: string,
  toDate: string,
  pettyCashType: string,
): Promise<number> => {
  const startDate = convertFromDate(fromDate);
  const endDate = convertToDate(toDate);
  return PettyCash.sum('amount', {
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          pettyCashType: {
            [Op.eq]: pettyCashType,
          },
        },
        {
          plantId,
        },
        {
          cashJournalId,
        },
        {
          documentStatus: {
            [Op.ne]: 'Saved',
          },
        },
      ],
    },
  });
};

const transactionReverse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      transactionIds, documentStatus, cashJournalId, fromDate, toDate,
    } = req.body;

    if (
      !validateRequestBody(
        transactionIds,
        documentStatus,
        cashJournalId,
        fromDate,
        toDate,
        req.body.cashDenomination,
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

    const updatedTransactionsCount = await getUpdateTransactionCount(
      transactionIds,
    );

    if (updatedTransactionsCount !== transactionIds.length) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const cashDenominationBody = calculateCashDenomination(req);
    const totalUpdateAmount = await getTotalUpdateAmount(transactionIds);
    const closingBalanceAmount = await getClosingBalance(req);

    const finalClosingBalance = await calculateFinalClosingBalance(
      closingBalanceAmount,
      totalUpdateAmount,
      transactionIds,
    );

    if (
      cashDenominationBody
      && finalClosingBalance !== cashDenominationBody.denominationTotalAmount
    ) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DENOMINATION_NOT_MATCH,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const updatedTransactionIds = [];

    for (const transactionId of transactionIds) {
      const {
        id,
        createdBy,
        updatedBy,
        documentStatus,
        amount,
        netAmount,
        taxBaseAmount,
        reverseTransactionId,
        ...restPettyCashData
      }: any = await PettyCash.findOne({ where: { id: transactionId }, raw: true });

      const pettyCash = {
        reverseTransactionId: id,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        documentStatus: 'Updated Reversed',
        amount: +new BigNumber(+amount).negated(),
        netAmount: +new BigNumber(+amount).negated(),
        taxBaseAmount: +new BigNumber(+amount).negated(),
        ...restPettyCashData,
      };

      const transactionData = await PettyCash.create(pettyCash);

      await PettyCash.update(
        { documentStatus: 'Updated Reversed' },
        { where: { id: transactionId } },
      );

      updatedTransactionIds.push(transactionData.id);
    }

    if (updatedTransactionIds.length === transactionIds.length) {
      const [cashDenominationData] = await CashDenomination.upsert(
        cashDenominationBody,
      );

      const response = responseFormatter(
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.TRANSACTION_REVERSED,
        cashDenominationData,
      );
      return res.status(CODE[200]).send(response);
    }
    const response = responseFormatter(
      CODE[400],
      SUCCESS.TRUE,
      MESSAGE.TRANSACTION_MAY_PARTIALLY_REVERSED,
      null,
    );
    return res.status(CODE[400]).send(response);
  } catch (err) {
    next(err);
  }
};

const getUpdateTransactionCount = (
  transactionIds: Array<string>,
): Promise<number> => {
  try {
    return PettyCash.count({
      where: {
        [Op.and]: [
          { id: { [Op.in]: transactionIds } },
          { documentStatus: 'Updated' },
        ],
      },
    });
  } catch (err) {
    throw err;
  }
};
/**
 * It returns the closing balance for a specified date range.
 * @param req
 * @returns
 */
const getClosingBalance = async (req: Request): Promise<number> => {
  try {
    const { cashJournalId, fromDate, toDate } = req.body;

    if (req.session.activePlantId) {
      const openingBalance = (await getOpeningBalance(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
      )) ?? 0;
      const totalCashReceipts = (await getTotalCashReceipts(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
        toDate,
      )) ?? 0;
      const totalCashPayments = (await getTotalCashPayments(
        req.session.activePlantId,
        cashJournalId,
        fromDate,
        toDate,
      )) ?? 0;

      return +new BigNumber(openingBalance)
        .plus(totalCashReceipts)
        .minus(totalCashPayments)
        .abs();
    }
    throw new Error(MESSAGE.SELECT_PLANT);
  } catch (err) {
    throw err;
  }
};

export default {
  create,
  findPaymentsWithPaginate,
  findReceiptsWithPaginate,
  update,
  updateDocumentStatus,
  deleteTransactions,
  exportPettyCash,
  getBalanceCalculation,
  transactionReverse,
};
