import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import MESSAGE from '../../src/config/message.json';
import { headerRequestBody } from '../mock-data/expenseHeaderMock';
import { debitRequestBody } from '../mock-data/expenseDebitTransactionMock';
import { creditRequestBody } from '../mock-data/expenseCreditTransactionMock';
import { CODE, SUCCESS } from '../../src/config/response';
import checkResponsePropertiesExist, {
  checkResponseBodyValue,
} from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';

describe('Expense Routes', () => {
  let agent: SuperTest<Test>;
  let expensesHeaderId: string;
  let expensesDebitTransactionId: string;
  let expensesCreditTransactionId: string;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    await stopServer();
  });

  // Test cases for createExpensesHeader function
  it('should return 200 with the created expenses header data on success', async () => {
    const res = await agent
      .post('/expenses/header')
      .send(headerRequestBody)
      .expect(200);

    expensesHeaderId = res.body.data.id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated expenses header data on success', async () => {
    const updateRequestBody = {
      expensesHeaderId,
      ...headerRequestBody,
    };

    const res = await agent
      .post('/expenses/header')
      .send(updateRequestBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for createExpensesDebitTransaction function
  it('should return 200 with the created expenses debit transaction data on success', async () => {
    const debitBody = {
      expensesHeaderId,
      ...debitRequestBody,
    };
    const res = await agent.post('/expenses/debit').send(debitBody).expect(200);

    expensesDebitTransactionId = res.body.data[0].id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated expenses debit transaction data on success', async () => {
    const debitBody = {
      expensesHeaderId,
      expensesDebitTransactionId,
      ...debitRequestBody,
    };

    const res = await agent.post('/expenses/debit').send(debitBody).expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for createExpensesCreditTransaction function
  it('should return 200 with the created expenses credit transaction data on success', async () => {
    const creditBody = {
      expensesHeaderId,
      ...creditRequestBody,
    };
    const res = await agent
      .post('/expenses/credit')
      .send(creditBody)
      .expect(200);

    expensesCreditTransactionId = res.body.data[0].id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated expenses credit transaction data on success', async () => {
    const creditBody = {
      expensesHeaderId,
      expensesCreditTransactionId,
      ...creditRequestBody,
    };

    const res = await agent
      .post('/expenses/credit')
      .send(creditBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for updateDocumentStatus function
  it('should return a 400 for updateDocumentStatus', async () => {
    const res = await agent
      .post('/expenses/update/status')
      .send({})
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

  it('should return success and updated the document status', async () => {
    const res = await agent
      .post('/expenses/update/status')
      .send({ expensesHeaderId })
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
  it('should return a 400 for missing field to call transactionReverse', async () => {
    const res = await agent
      .post('/expenses/transaction-reverse')
      .send({})
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

  it('should return success and reverse the document', async () => {
    const transactionReverseBody = {
      expensesHeaderId,
      debitTransactionIds: [expensesDebitTransactionId],
      creditTransactionIds: [expensesCreditTransactionId],
    };
    const res = await agent
      .post('/expenses/transaction-reverse')
      .send(transactionReverseBody)
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
