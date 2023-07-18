import { NextFunction, Request, Response } from 'express';
import { BigNumber } from 'bignumber.js';
import * as xlsx from 'xlsx';
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
    const salesDebitTransactions = await ExpensesDebitTransaction.findAll({
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
          model: DocumentType,
        },
        {
          model: PostingKey,
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
      raw: true,
      nest: true,
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

interface UpdateSalesHeaderArgs {
  newDocumentStatus: 'Updated' | 'Updated Reversed';
  oldDocumentStatus: 'Saved' | 'Updated';
  salesHeaderId: string;
  reversalId?: string;
}

const updateSalesHeader = ({
  newDocumentStatus,
  oldDocumentStatus,
  salesHeaderId,
  reversalId,
}: UpdateSalesHeaderArgs) =>
  SalesHeader.update(
    { documentStatus: newDocumentStatus, reversalId },
    { where: { id: salesHeaderId, documentStatus: oldDocumentStatus } },
  );

const getSaleHeaderData = (salesHeaderId: string) =>
  SalesHeader.findOne({
    where: { id: salesHeaderId },
    raw: true,
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
    const totalDebitAmount = await calculateTotalAmount(salesHeaderId, 'debit');
    const totalCreditAmount = await calculateTotalAmount(
      salesHeaderId,
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
      raw: true,
    });

    if (!saleHeader) {
      const response = responseFormatter(
        CODE[401],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const reverseSalesHeader = {
      ...saleHeader,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      documentStatus: 'Updated Reversed',
    } as unknown as SalesHeaderModel;

    const reversedSalesHeader = await SalesHeader.create(reverseSalesHeader);

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
          salesHeaderId: reversedSalesHeader?.id,
          businessTransactionId: salesDebitTransaction?.businessTransactionId,
          glAccountId: salesDebitTransaction?.glAccountId,
          documentTypeId: salesDebitTransaction?.documentTypeId,
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
          salesHeaderId: reversedSalesHeader?.id,
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

    await createOneTimeCustomer(
      req.user.id,
      reversedSalesHeader?.id,
      salesHeaderId,
    );

    await updateSalesHeader({
      newDocumentStatus: 'Updated Reversed',
      oldDocumentStatus: 'Updated',
      salesHeaderId,
      reversalId: reversedSalesHeader?.id,
    });

    const salesHeaderData = await getSaleHeaderData(salesHeaderId);

    let newSalesHeaderData = salesHeaderData;

    if (
      salesHeaderData &&
      salesHeaderData.documentStatus === 'Updated Reversed' &&
      salesHeaderData.reversalId === null
    ) {
      const reversalDocument = (await SalesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: salesHeaderData.id },
        raw: true,
      })) as SalesHeaderModel;
      newSalesHeaderData = {
        ...salesHeaderData,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as SalesHeaderWithDocumentLabel;
    } else if (
      salesHeaderData &&
      salesHeaderData.documentStatus === 'Updated Reversed' &&
      salesHeaderData.reversalId !== null
    ) {
      newSalesHeaderData = {
        ...salesHeaderData,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as SalesHeaderWithDocumentLabel;
    }

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.TRANSACTION_REVERSED,
      newSalesHeaderData,
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

    const salesHeaderFromDocumentNumber = await SalesHeader.findOne({
      where: { id: documentNumber },
      raw: true,
    });

    if (!salesHeaderFromDocumentNumber) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.INVALID_DOCUMENT_NUMBER,
        null,
      );
      return res.status(400).send(response);
    }

    let newSalesHeaderFromDocumentNumber = salesHeaderFromDocumentNumber;

    if (
      salesHeaderFromDocumentNumber &&
      salesHeaderFromDocumentNumber.documentStatus === 'Updated Reversed' &&
      salesHeaderFromDocumentNumber.reversalId === null
    ) {
      const reversalDocument = (await SalesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: salesHeaderFromDocumentNumber.id },
        raw: true,
      })) as SalesHeaderModel;
      newSalesHeaderFromDocumentNumber = {
        ...salesHeaderFromDocumentNumber,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as SalesHeaderWithDocumentLabel;
    } else if (
      salesHeaderFromDocumentNumber &&
      salesHeaderFromDocumentNumber.documentStatus === 'Updated Reversed' &&
      salesHeaderFromDocumentNumber.reversalId !== null
    ) {
      newSalesHeaderFromDocumentNumber = {
        ...salesHeaderFromDocumentNumber,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as SalesHeaderWithDocumentLabel;
    }

    const debitTransactionData = await SalesDebitTransaction.findAll({
      where: { salesHeaderId: salesHeaderFromDocumentNumber.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: DocumentType,
        },
        {
          model: PostingKey,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    });

    const creditTransactionData = await SalesCreditTransaction.findAll({
      where: { salesHeaderId: salesHeaderFromDocumentNumber.id },
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
      raw: true,
      nest: true,
    });

    const oneTimeCustomerData = await OneTimeCustomer.findOne({
      where: { salesHeaderId: salesHeaderFromDocumentNumber.id },
      raw: true,
    });

    const data = {
      saleHeaderData: newSalesHeaderFromDocumentNumber,
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

const getLastDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const salesHeaderFromPlantId = await SalesHeader.findOne({
      where: { plantId: req.session.activePlantId },
      order: [['createdAt', 'desc']],
      raw: true,
    });
    if (!salesHeaderFromPlantId) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_NOT_FOUND,
        null,
      );
      return res.status(400).send(response);
    }

    let newSalesHeaderFromPlantId = salesHeaderFromPlantId;

    if (
      salesHeaderFromPlantId &&
      salesHeaderFromPlantId.documentStatus === 'Updated Reversed' &&
      salesHeaderFromPlantId.reversalId === null
    ) {
      const reversalDocument = (await SalesHeader.findOne({
        attributes: ['id'],
        where: { reversalId: salesHeaderFromPlantId.id },
        raw: true,
      })) as SalesHeaderModel;
      newSalesHeaderFromPlantId = {
        ...salesHeaderFromPlantId,
        documentLabel: MESSAGE.REVERSAL_DOCUMENT,
        reversalId: reversalDocument.id,
      } as SalesHeaderWithDocumentLabel;
    } else if (
      salesHeaderFromPlantId &&
      salesHeaderFromPlantId.documentStatus === 'Updated Reversed' &&
      salesHeaderFromPlantId.reversalId !== null
    ) {
      newSalesHeaderFromPlantId = {
        ...salesHeaderFromPlantId,
        documentLabel: MESSAGE.ORIGINAL_DOCUMENT,
      } as SalesHeaderWithDocumentLabel;
    }

    const debitTransactionData = await SalesDebitTransaction.findAll({
      where: { salesHeaderId: salesHeaderFromPlantId.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: DocumentType,
        },
        {
          model: PostingKey,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    });

    const creditTransactionData = await SalesCreditTransaction.findAll({
      where: { salesHeaderId: salesHeaderFromPlantId.id },
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
      raw: true,
      nest: true,
    });

    const oneTimeCustomerData = await OneTimeCustomer.findOne({
      where: { salesHeaderId: salesHeaderFromPlantId.id },
      raw: true,
    });

    const data = {
      saleHeaderData: newSalesHeaderFromPlantId,
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

const exportSalesReceipt = async (
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

    const saleHeaderData = await SalesHeader.findOne({
      where: { id: salesHeaderId, documentStatus: 'Updated' },
      raw: true,
    });

    if (!saleHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_EXPORT_ALLOWED,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const debitTransactionData = (await SalesDebitTransaction.findAll({
      where: { salesHeaderId: saleHeaderData.id },
      include: [
        {
          model: BusinessTransaction,
        },
        {
          model: GlAccount,
        },
        {
          model: DocumentType,
        },
        {
          model: PostingKey,
        },
        {
          model: ProfitCentre,
        },
      ],
      raw: true,
      nest: true,
    })) as SalesDebitTransactionModelWithIncludes[];

    const creditTransactionData = (await SalesCreditTransaction.findAll({
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
      raw: true,
      nest: true,
    })) as SalesCreditTransactionModelWithIncludes[];

    const saleReceiptData = [
      {
        postingDate: dateFormat(saleHeaderData.postingDate, '.', false),
        documentDate: dateFormat(saleHeaderData.documentDate, '.', false),
        customerNo: creditTransactionData[0]?.customer?.customerNo
          ? creditTransactionData[0]?.customer?.customerNo
          : '',
        amount: creditTransactionData[0].amount,
        PostingKey: debitTransactionData[0]?.posting_key?.postingKey,
        profitCentre: debitTransactionData[0]?.profit_centre?.profitCentre,
        text: creditTransactionData[0].text,
      },
    ];

    const heading = [
      [
        'Document Date',
        'Posting Date',
        'CustomerNo',
        'Amount',
        'PostingKey',
        'ProfitCenter',
        'Text',
      ],
    ];

    // Had to create a new workbook and then add the header
    const workbook = xlsx.utils.book_new();
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_aoa(worksheet, heading);

    // Starting in the second row to avoid overriding and skipping headers
    xlsx.utils.sheet_add_json(worksheet, saleReceiptData, {
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

    const saleHeaderData = await SalesHeader.findOne({
      where: { id: salesHeaderId, documentStatus: 'Saved' },
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

    await OneTimeCustomer.destroy({ where: { salesHeaderId } });
    await SalesDebitTransaction.destroy({ where: { salesHeaderId } });
    await SalesCreditTransaction.destroy({ where: { salesHeaderId } });
    await SalesHeader.destroy({ where: { id: salesHeaderId } });

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
  exportSalesReceipt,
  deleteDocument,
};
