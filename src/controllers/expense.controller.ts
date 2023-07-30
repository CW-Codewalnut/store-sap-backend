import { NextFunction, Request, Response } from 'express';
import * as xlsx from 'xlsx';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';
import BusinessTransaction from '../models/business-transaction';
import GlAccount from '../models/gl-account';
import PostingKey from '../models/posting-key';
import ProfitCentre from '../models/profit-centre';
import Plant from '../models/plant';
import { dateFormat } from '../utils/helper';
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
import ExpensesDebitTransactionModel, {
  ExpensesDebitTransactionModelWithIncludes,
} from '../interfaces/masters/expensesDebitTransaction.interface';
import Vendor from '../models/vendor';
import SectionCode from '../models/section-code';
import WithholdingTax from '../models/withholding-tax';
import ExpensesCreditTransactionModel, {
  ExpensesCreditTransactionModelWithIncludes,
} from '../interfaces/masters/expensesCreditTransaction.interface';
import PaymentTerm from '../models/payment-term';

const getExpensesHeaderData = (expensesHeaderId: string) =>
  ExpensesHeader.findOne({
    where: {
      id: expensesHeaderId,
    },
    include: [
      {
        model: Plant,
      },
    ],
    raw: true,
    nest: true,
  });

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
    const expensesHeaderData = await getExpensesHeaderData(expensesHeader.id);

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

const getExpensesDebitTransaction = (expensesHeaderId: string) =>
  ExpensesDebitTransaction.findAll({
    where: {
      expensesHeaderId,
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

    const expensesDebitTransactions = await getExpensesDebitTransaction(
      req.body.expensesHeaderId,
    );

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
 * Check line item one consist at least one transaction;
 * @param expensesHeaderId
 * @returns
 */
const checkLineItemOneExist = async (expensesHeaderId: string) =>
  ExpensesDebitTransaction.count({
    where: {
      expensesHeaderId,
    },
  });

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

const getExpensesCreditTransaction = (expensesHeaderId: string) =>
  ExpensesCreditTransaction.findAll({
    where: { expensesHeaderId },
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
      {
        model: PaymentTerm,
      },
    ],
    raw: true,
    nest: true,
  });

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

    // Check line item 1 debit transaction exists
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

    const expensesCreditTransactions = await getExpensesCreditTransaction(
      req.body.expensesHeaderId,
    );

    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      expensesCreditTransactions,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    console.log(err);
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

const findExpensesHeaderByDocumentStatus = (
  expensesHeaderId: string,
  documentStatus: string,
) =>
  ExpensesHeader.findOne({
    where: { id: expensesHeaderId, documentStatus },
    raw: true,
  });

// Function to create a reversed expenses header
const createReversedExpensesHeader = async (
  expensesHeader: ExpensesHeaderModel,
  req: Request,
) => {
  const expensesHeaderData = {
    ...expensesHeader,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    createdBy: req.user.id,
    updatedBy: req.user.id,
    documentStatus: 'Updated Reversed',
  } as unknown as ExpensesHeaderModel;

  return ExpensesHeader.create(expensesHeaderData);
};

// Perform debit transaction reversal
const reverseDebitTransactions = async (
  debitTransactionIds: string[],
  reversedExpensesHeaderId: string,
  req: Request,
): Promise<void> => {
  try {
    const debitTransactions = await ExpensesDebitTransaction.findAll({
      where: { id: debitTransactionIds },
    });

    // Create an array to store the updated reversed debit transactions
    const reversedDebitTransactions = (await Promise.all(
      debitTransactions.map(async (debitTransaction) => {
        const postingKeyData = await PostingKey.findOne({
          where: { id: debitTransaction.postingKeyId },
        });

        // Create the reversed debit transaction object
        return {
          expensesHeaderId: reversedExpensesHeaderId,
          businessTransactionId: debitTransaction.businessTransactionId,
          glAccountId: debitTransaction.glAccountId,
          specialGlIndicatorId: debitTransaction.specialGlIndicatorId,
          description: debitTransaction.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: debitTransaction.amount,
          taxCodeId: debitTransaction.taxCodeId,
          businessPlaceId: debitTransaction.businessPlaceId,
          costCentreId: debitTransaction.costCentreId,
          profitCentreId: debitTransaction.profitCentreId,
          assignment: debitTransaction.assignment,
          text: debitTransaction.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    )) as ExpensesDebitTransactionModel[];

    await ExpensesDebitTransaction.bulkCreate(reversedDebitTransactions);
  } catch (error) {
    throw new Error('Failed to perform debit transaction reversal.');
  }
};

// Perform credit transaction reversal
const reverseCreditTransactions = async (
  creditTransactionIds: string[],
  reversedExpensesHeaderId: string,
  req: Request,
): Promise<void> => {
  try {
    const creditTransactions = await ExpensesCreditTransaction.findAll({
      where: { id: creditTransactionIds },
    });

    // Create an array to store the updated reversed credit transactions
    const reversedCreditTransactions = (await Promise.all(
      creditTransactions.map(async (creditTransaction) => {
        const postingKeyData = await PostingKey.findOne({
          where: { id: creditTransaction.postingKeyId },
        });

        // Create the reversed credit transaction object
        return {
          expensesHeaderId: reversedExpensesHeaderId,
          vendorId: creditTransaction.vendorId,
          description: creditTransaction.description,
          postingKeyId: postingKeyData?.postingKeyReversalId,
          amount: creditTransaction.amount,
          specialGlIndicatorId: creditTransaction.specialGlIndicatorId,
          taxCodeId: creditTransaction.taxCodeId,
          businessPlaceId: creditTransaction.businessPlaceId,
          sectionCodeId: creditTransaction.sectionCodeId,
          withholdingTaxId: creditTransaction.withholdingTaxId,
          paymentTermId: creditTransaction.paymentTermId,
          assignment: creditTransaction.assignment,
          text: creditTransaction.text,
          createdBy: req.user.id,
          updatedBy: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    )) as ExpensesCreditTransactionModel[];

    await ExpensesCreditTransaction.bulkCreate(reversedCreditTransactions);
  } catch (error) {
    throw new Error('Failed to perform credit transaction reversal.');
  }
};

const getReversalDocument = (reversalId: string) =>
  ExpensesHeader.findOne({
    attributes: ['id'],
    where: { reversalId },
    raw: true,
  });

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

    const expensesHeader = await findExpensesHeaderByDocumentStatus(
      expensesHeaderId,
      'Updated',
    );

    if (!expensesHeader) {
      const response = responseFormatter(
        CODE[401],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    // Create a reversed expenses header
    const reversedExpensesHeader = await createReversedExpensesHeader(
      expensesHeader,
      req,
    );

    // Debit Transaction Reversal
    await reverseDebitTransactions(
      debitTransactionIds,
      reversedExpensesHeader?.id,
      req,
    );

    // Credit Transaction Reversal
    await reverseCreditTransactions(
      creditTransactionIds,
      reversedExpensesHeader?.id,
      req,
    );

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
      const reversalDocument = (await getReversalDocument(
        expensesHeaderData.id,
      )) as ExpensesHeaderModel;

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

    const expensesHeaderData = await findExpensesHeaderByDocumentStatus(
      transactionData?.expensesHeaderId,
      'Saved',
    );

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

    const expensesHeaderFromDocumentNumber = await getExpensesHeaderData(
      documentNumber,
    );

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
      const reversalDocument = (await getReversalDocument(
        expensesHeaderFromDocumentNumber.id,
      )) as ExpensesHeaderModel;

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

    const debitTransactionData = await getExpensesDebitTransaction(
      expensesHeaderFromDocumentNumber.id,
    );
    const creditTransactionData = await getExpensesCreditTransaction(
      expensesHeaderFromDocumentNumber.id,
    );

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
      const reversalDocument = (await getReversalDocument(
        expensesHeaderFromPlantId.id,
      )) as ExpensesHeaderModel;

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

    const debitTransactionData = await getExpensesDebitTransaction(
      expensesHeaderFromPlantId.id,
    );
    const creditTransactionData = await getExpensesCreditTransaction(
      expensesHeaderFromPlantId.id,
    );

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
    const expensesHeaderData = await findExpensesHeaderByDocumentStatus(
      expensesHeaderId,
      'Updated',
    );

    if (!expensesHeaderData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DOCUMENT_EXPORT_ALLOWED,
        null,
      );
      return res.status(CODE[400]).send(response);
    }

    const debitTransactionData = (await getExpensesDebitTransaction(
      expensesHeaderData.id,
    )) as ExpensesDebitTransactionModelWithIncludes[];
    const creditTransactionData = (await getExpensesCreditTransaction(
      expensesHeaderData.id,
    )) as ExpensesCreditTransactionModelWithIncludes[];

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

    const expensesHeaderData = await findExpensesHeaderByDocumentStatus(
      expensesHeaderId,
      'Saved',
    );

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
