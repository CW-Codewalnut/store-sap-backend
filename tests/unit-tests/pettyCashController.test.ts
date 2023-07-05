import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import MESSAGE from '../../src/config/message.json';
import { requestBody } from '../mock-data/pettyCashMock';
import { CODE, SUCCESS } from '../../src/config/response';
import PettyCash from '../../src/models/petty-cash';
import checkResponsePropertiesExist, {
  checkResponseBodyValue,
} from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';
import CashDenomination from '../../src/models/cash-denomination';
import CashDenominationModel from '../../src/interfaces/masters/cashDenomination.interface';
import PettyCashModel from '../../src/interfaces/masters/pettyCash.interface';

describe('Petty Cash Routes', () => {
  let agent: SuperTest<Test>;
  let pettyCashCreatedId: string;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    await stopServer();
  });

  // Test cases for create function
  it('should return a 400 error due to a missing required property', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { amount, ...requestBodyWithError } = requestBody;

    const res = await agent
      .post('/petty-cash')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error due to invalid data types', async () => {
    const requestBodyWithError = { ...requestBody, amount: '5000' };

    const res = await agent
      .post('/petty-cash')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error when the closing balance is exceeded', async () => {
    const requestBodyWithError = {
      ...requestBody,
      amount: 10000,
      pettyCashType: 'Payment',
      fromDate: new Date(),
      toDate: new Date(),
    };
    const res = await agent
      .post('/petty-cash')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.AMOUNT_EXCEEDING_CLOSING_BAL,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error when the tax code is invalid', async () => {
    const requestBodyWithError = {
      ...requestBody,
      taxCodeId: 'NTO9O9_l3HBzNczk',
    };

    const res = await agent
      .post('/petty-cash')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TAX_CODE_INVALID,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error when the petty cash limit is exceeded', async () => {
    const requestBodyWithError = { ...requestBody, amount: 10001 };

    const res = await agent
      .post('/petty-cash')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.PETTY_CASH_LIMIT,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should successfully create a new petty cash entry', async () => {
    await PettyCash.destroy({ where: { documentStatus: 'Saved' } });
    const res = await agent.post('/petty-cash').send(requestBody).expect(200);

    pettyCashCreatedId = res.body.data.id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.DOCUMENT_SAVED,
      ),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for findPaymentsWithPaginate function
  it('should return app payment transaction between dates when authenticated', async () => {
    // eslint-disable-next-line no-shadow
    const requestBody = {
      fromDate: new Date(),
      toDate: new Date(),
      cashJournalId: 'o2kHOE6HrgrgaGjH',
    };
    const res = await agent
      .post('/petty-cash/payments/paginate?page=1&pageSize=10&search=')
      .send(requestBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);

    // Test if count exists and is a number
    expect(res.body.data).toHaveProperty('count');
    expect(typeof res.body.data.count).toBe('number');

    // Test if rows exists and is an array
    expect(res.body.data).toHaveProperty('rows');
    expect(Array.isArray(res.body.data.rows)).toBe(true);
  });

  // Test cases for findReceiptsWithPaginate function
  it('should return app receipt transaction between dates when authenticated', async () => {
    // eslint-disable-next-line no-shadow
    const requestBody = {
      fromDate: new Date(),
      toDate: new Date(),
      cashJournalId: 'o2kHOE6HrgrgaGjH',
    };
    const res = await agent
      .post('/petty-cash/receipts/paginate?page=1&pageSize=10&search=')
      .send(requestBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);

    // Test if count exists and is a number
    expect(res.body.data).toHaveProperty('count');
    expect(typeof res.body.data.count).toBe('number');

    // Test if rows exists and is an array
    expect(res.body.data).toHaveProperty('rows');
    expect(Array.isArray(res.body.data.rows)).toBe(true);
  });

  // Test cases for getBalanceCalculation function
  it('should return a bad request error if required data is missing', async () => {
    // eslint-disable-next-line no-shadow
    const requestBody = {
      fromDate: '2023-01-01',
      toDate: '',
      cashJournalId: 1,
    };

    const res = await agent
      .post('/petty-cash/balance-calculation')
      .send(requestBody)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a success for balance calculation', async () => {
    // eslint-disable-next-line no-shadow
    const requestBody = {
      fromDate: new Date(),
      toDate: new Date(),
      cashJournalId: 'o2kHOE6HrgrgaGjH',
    };

    const res = await agent
      .post('/petty-cash/balance-calculation')
      .send(requestBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for update function
  it('should return a 400 error due to invalid amount type', async () => {
    const requestBodyWithError = { ...requestBody, amount: '5000' };

    const res = await agent
      .patch('/petty-cash/xnH6TKvkUfoL7yRF')
      .send(requestBodyWithError)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it("should return a 400 error due to missing 'text' field", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { text, ...requestBodyWithMissingField } = requestBody;

    const res = await agent
      .patch('/petty-cash/xnH6TKvkUfoL7yRF')
      .send(requestBodyWithMissingField)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a success for petty cash update if document status is Updated', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Updated' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyData = {
      ...restTransactionData,
      refDocNo: requestBody.refDocNo,
      assignment: requestBody.assignment,
      text: requestBody.text,
      fromDate: new Date(),
      toDate: new Date(),
    };

    const res = await agent
      .patch(`/petty-cash/${id}`)
      .send(requestBodyData)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.DOCUMENT_UPDATED,
      ),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error due to invalid transaction Id', async () => {
    const res = await agent
      .patch('/petty-cash/12345')
      .send(requestBody)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_ID_NOT_FOUND,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error when the tax code is invalid', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Saved' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyWithWrongTaxCodeId = {
      ...restTransactionData,
      taxCodeId: '2T9kgBIQXd2nYLVd',
      fromDate: new Date(),
      toDate: new Date(),
    };

    const res = await agent
      .patch(`/petty-cash/${id}`)
      .send(requestBodyWithWrongTaxCodeId)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TAX_CODE_INVALID,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 error when the amount is invalid', async () => {
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Saved' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyWithWrongAmount = {
      ...restTransactionData,
      amount: 10001,
      fromDate: new Date(),
      toDate: new Date(),
    };
    const res = await agent
      .patch(`/petty-cash/${id}`)
      .send(requestBodyWithWrongAmount)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.PETTY_CASH_LIMIT,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a success for petty cash update if document status is Saved', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Saved' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyData = {
      ...restTransactionData,
      fromDate: new Date(),
      toDate: new Date(),
    };
    const res = await agent
      .patch(`/petty-cash/${id}`)
      .send(requestBodyData)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.DOCUMENT_UPDATED,
      ),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for updateDocumentStatus function
  it('should return a 400 for missing cash denomination while update the document status', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Saved' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyData = {
      transactionIds: [id],
      documentStatus: 'Updated',
      cashJournalId: restTransactionData.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
    };

    const res = await agent
      .post(`/petty-cash/update/status`)
      .send(requestBodyData)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 if cash denomination does not match the closing balance while updating document status', async () => {
    const cashDenominationData = await CashDenomination.findOne({
      where: {
        plantId: requestBody.plantId,
        cashJournalId: requestBody.cashJournalId,
      },
      raw: true,
    });

    const { id, ...cashDenomination } =
      cashDenominationData as CashDenominationModel;

    const requestBodyData = {
      transactionIds: [pettyCashCreatedId],
      documentStatus: 'Updated',
      cashJournalId: requestBody.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
      denominationId: id,
      cashDenomination,
    };

    const res = await agent
      .post(`/petty-cash/update/status`)
      .send(requestBodyData)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DENOMINATION_NOT_MATCH,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  // This specific test case is related to transactionReverse function but placed here to pass
  it('should return a 400 when attempting to reverse a non-updated document', async () => {
    const requestBodyData = {
      transactionIds: [pettyCashCreatedId],
      documentStatus: 'Updated Reversed',
      cashJournalId: requestBody.cashJournalId,
      cashDenomination: {},
      fromDate: new Date(),
      toDate: new Date(),
    };

    const res = await agent
      .post(`/petty-cash/transaction-reverse`)
      .send(requestBodyData)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.TRANSACTION_REVERSED_CONTAINS,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return success on document status update', async () => {
    const cashDenominationData = await CashDenomination.findOne({
      where: {
        plantId: requestBody.plantId,
        cashJournalId: requestBody.cashJournalId,
      },
      raw: true,
    });

    const { id, ...cashDenomination } =
      cashDenominationData as CashDenominationModel;

    const { qty500INR } = cashDenomination;
    cashDenomination.qty500INR = qty500INR + 1;

    const requestBodyData = {
      transactionIds: [pettyCashCreatedId],
      documentStatus: 'Updated',
      cashJournalId: requestBody.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
      denominationId: id,
      cashDenomination,
    };

    const res = await agent
      .post(`/petty-cash/update/status`)
      .send(requestBodyData)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.DOCUMENT_LOCKED,
      ),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for transactionReverse function
  it('should return a 400 for missing cash denomination while reverse the transaction', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactionData = await PettyCash.findOne({
      where: { documentStatus: 'Updated' },
      raw: true,
    });

    const { id, ...restTransactionData } = transactionData as PettyCashModel;

    const requestBodyData = {
      transactionIds: [id],
      documentStatus: 'Updated',
      cashJournalId: restTransactionData.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
    };

    const res = await agent
      .post(`/petty-cash/transaction-reverse`)
      .send(requestBodyData)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.BAD_REQUEST,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return a 400 if cash denomination does not match while doing transaction reverse', async () => {
    const cashDenomination = await CashDenomination.findOne({
      where: {
        plantId: requestBody.plantId,
        cashJournalId: requestBody.cashJournalId,
      },
      raw: true,
    });

    const requestBodyData = {
      transactionIds: [pettyCashCreatedId],
      documentStatus: 'Updated',
      cashJournalId: requestBody.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
      cashDenomination,
    };

    const res = await agent
      .post(`/petty-cash/transaction-reverse`)
      .send(requestBodyData)
      .expect(400);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[400],
        SUCCESS.FALSE,
        MESSAGE.DENOMINATION_NOT_MATCH,
      ),
    ).toEqual(true);
    expect(res.body.data).toEqual(MESSAGE.NULL);
  });

  it('should return success when document reversed', async () => {
    const cashDenominationData = await CashDenomination.findOne({
      where: {
        plantId: requestBody.plantId,
        cashJournalId: requestBody.cashJournalId,
      },
      raw: true,
    });

    const { id, ...cashDenomination } =
      cashDenominationData as CashDenominationModel;

    const { qty500INR } = cashDenomination;
    cashDenomination.qty500INR = qty500INR - 1;

    const requestBodyData = {
      transactionIds: [pettyCashCreatedId],
      documentStatus: 'Updated Reversed',
      cashJournalId: requestBody.cashJournalId,
      fromDate: new Date(),
      toDate: new Date(),
      denominationId: id,
      cashDenomination,
    };

    const res = await agent
      .post(`/petty-cash/transaction-reverse`)
      .send(requestBodyData)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res,
        CODE[200],
        SUCCESS.TRUE,
        MESSAGE.TRANSACTION_REVERSED,
      ),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });
});
