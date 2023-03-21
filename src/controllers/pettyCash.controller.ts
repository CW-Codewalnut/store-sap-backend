import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
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
import * as xlsx from 'xlsx';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    pettyCashBody.createdBy = req.user.id;
    pettyCashBody.updatedBy = req.user.id;
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

    return PettyCash.findAndCountAll({
      include: [
        {
          model: BusinessTransaction
        },
        {
          model: TaxCode
        },
        {
          model: GlAccount
        },
        {
          model: BankAccount,
          include: [
            {
              model: HouseBank
            }
          ]
        },
        {
          model: Vendor
        },
        {
          model: Customer
        },
        {
          model: Plant
        },
        {
          model: CostCentre
        },
        {
          model: ProfitCentre
        },
        {
          model: Segment
        },
        {
          model: Employee
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
      where: { id: transactionId, documentStatus: 'Save' },
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

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Transactions are locked in application level.',
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
          { documentStatus: { [Op.eq]: 'Save' } },
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
        'Document status with Save only permitted to delete',
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    await PettyCash.destroy({
      where: {
        [Op.and]: [
          { id: { [Op.in]: transactionIds } },
          { documentStatus: { [Op.eq]: 'Save' } },
        ],
      },
    });

    const transactionSlug = transactionIds.length > 1 ? 'Transactions' : 'Transaction';

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
          model: BusinessTransaction
        },
        {
          model: TaxCode
        },
        {
          model: GlAccount
        },
        {
          model: BankAccount,
          include: [
            {
              model: HouseBank
            }
          ]
        },
        {
          model: Vendor
        },
        {
          model: Customer
        },
        {
          model: Plant
        },
        {
          model: CostCentre
        },
        {
          model: ProfitCentre
        },
        {
          model: Segment
        },
        {
          model: Employee
        },
      ],
      where: {
        [Op.and]: [
          { createdAt: { [Op.between]: [fromDate, toDate] } },
          {documentStatus: {[Op.eq]: 'Update'}}
        ]
      }
    });
    
    const data = pettyCashes.map(transaction => {
      return {
        businessTranactionNo: transaction.businessTransactionId 
      }
    });
    console.log('aaayyyyyyyyyyyyyyyyyyyyyyyyyyyyaaaaaaaaaaaaaaa', data);
    // create workbook
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');
  
    // send workbook as a download
    const buffer = xlsx.write(workbook, { type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err: any) {
    next(err);
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
};
