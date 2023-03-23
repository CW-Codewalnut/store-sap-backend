import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import * as xlsx from 'xlsx';
import { BigNumber } from 'bignumber.js';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import { MESSAGE } from '../utils/constant';
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
import { dateFormat } from '../utils/helper';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pettyCashBody = req.body;
    const isValidTaxCode = await checkTaxCode(pettyCashBody, res);
    if (!isValidTaxCode) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        'Invalid tax code',
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    pettyCashBody.postingDate = new Date(
      pettyCashBody.postingDate,
    ).toISOString();
    pettyCashBody.documentDate = new Date(
      pettyCashBody.documentDate,
    ).toISOString();
    pettyCashBody.referenceDate = pettyCashBody.referenceDate
      ? new Date(pettyCashBody.referenceDate).toISOString()
      : null;
    pettyCashBody.createdBy = req.user.id;
    pettyCashBody.updatedBy = req.user.id;
    pettyCashBody.plantId = req.session.activePlantId;
    const pettyCashResult = await PettyCash.create(pettyCashBody);
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      pettyCashResult,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

/**
 * To check tax code must be V0
 */
const checkTaxCode = async (
  pettyCashBody: any,
  res: Response,
): Promise<boolean> => {
  if (pettyCashBody.taxCodeId) {
    const isTaxCodeExist = await TaxCode.findOne({
      where: { id: pettyCashBody.taxCodeId, taxCode: 'V0' },
    });
    if (!isTaxCodeExist) {
      return false;
    }
    if (pettyCashBody.taxRate !== 0) {
      return false;
    }
    return true;
  }
  return false;
};

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
    const { fromDate } = req.body;
    const { toDate } = req.body;
    const query = [];

    if (fromDate && toDate) {
      const dateBy = { createdAt: { [Op.between]: [fromDate, toDate] } };
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
  } catch (err: any) {
    next(err);
  }
};

const findPaymentsWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cashPayment = await getPettyCashData(req, next, 'Payment');

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      cashPayment,
    );
    res.status(200).send(response);
  } catch (err: any) {
    next(err);
  }
};

const findReceiptsWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cashReceipt = await getPettyCashData(req, next, 'Receipt');

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      cashReceipt,
    );
    res.status(200).send(response);
  } catch (err: any) {
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
    const pettyCashBody = req.body;
    pettyCashBody.postingDate = new Date(
      pettyCashBody.postingDate,
    ).toISOString();
    pettyCashBody.documentDate = new Date(
      pettyCashBody.documentDate,
    ).toISOString();
    pettyCashBody.referenceDate = pettyCashBody.referenceDate
      ? new Date(pettyCashBody.referenceDate).toISOString()
      : null;
    const transactionData = await PettyCash.findOne({
      where: { id: transactionId, documentStatus: 'Saved' },
    });
    if (!transactionData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        'Update not allowed',
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    await PettyCash.update(pettyCashBody, { where: { id: transactionId } });
    const pettyCashResult = await PettyCash.findOne({
      where: { id: transactionId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      pettyCashResult,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
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
    const { transactionIds, documentStatus } = req.body;
    if (!Array.isArray(transactionIds) || !transactionIds.length) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    transactionIds.forEach(async (transactionId: string) => {
      await PettyCash.update({ documentStatus }, { where: { id: transactionId } });
    });

    const documentSlug = transactionIds.length > 1 ? 'Documents are' : 'Document is';

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      `${documentSlug} locked in app successfully`,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
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
        'Only deletion is allowed for documents with Save status',
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
      `${transactionSlug} successfully deleted`,
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
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
          { createdAt: { [Op.between]: [fromDate, toDate] } },
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
      postingDate: dateFormat(transaction.postingDate),
      documentDate: dateFormat(transaction.documentDate),
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
  } catch (err: any) {
    next(err);
  }
};

const getBalanceCalculation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fromDate, toDate } = req.body;
    if (!req.body || !fromDate || !toDate) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const openingBalance = (await getOpeningBalance()) || 0;
    const totalCashReceipts = (await getTotalCashReceipts()) || 0;
    const totalCashPayments = (await getTotalCashPayments()) || 0;
    const closingBalance = +new BigNumber(
      openingBalance + totalCashReceipts - totalCashPayments,
    ).abs();

    console.log('openingBalance====> ', openingBalance);
    console.log('totalCashReceipts====> ', totalCashReceipts);
    console.log('totalCashPayments====> ', totalCashPayments);
    console.log('closingBalance====> ', closingBalance);

    const balanceCalculations = {
      openingBalance,
      totalCashReceipts,
      totalCashPayments,
      closingBalance,
    };

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      balanceCalculations,
    );
    res.status(200).send(response);
  } catch (err: any) {
    next(err);
  }
};

const getOpeningBalance = () => {
  const today = new Date();
  const formattedDate = today.toISOString().substring(0, 10);
  return PettyCash.sum('amount', {
    where: {
      createdAt: {
        [Op.lt]: formattedDate,
      },
    },
  });
};

const getTotalCashPayments = () => {
  const fromDate = new Date('2023-03-23 00:00:00').toISOString();
  const toDate = new Date('2023-03-23 23:59:59').toISOString();
  return PettyCash.sum('amount', {
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.between]: [fromDate, toDate],
          },
        },
        {
          pettyCashType: {
            [Op.eq]: 'Payment',
          },
        },
      ],
    },
  });
};

const getTotalCashReceipts = () => {
  const fromDate = new Date('2023-03-23 00:00:00').toISOString();
  const toDate = new Date('2023-03-23 23:59:59').toISOString();
  return PettyCash.sum('amount', {
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.between]: [fromDate, toDate],
          },
        },
        {
          pettyCashType: {
            [Op.eq]: 'Receipt',
          },
        },
      ],
    },
  });
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
};
