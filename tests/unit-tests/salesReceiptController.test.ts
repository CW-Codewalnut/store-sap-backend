import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import MESSAGE from '../../src/config/message.json';
import { headerRequestBody } from '../mock-data/saleHeaderMock';
import { debitRequestBody } from '../mock-data/saleDebitTransactionMock';
import { creditRequestBody } from '../mock-data/saleCreditTransactionMock';
import { CODE, SUCCESS } from '../../src/config/response';
import checkResponsePropertiesExist, {
  checkResponseBodyValue,
} from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';
import SalesHeader from '../../src/models/sales-header';
import SalesDebitTransaction from '../../src/models/sales-debit-transaction';
import SalesCreditTransaction from '../../src/models/sales-credit-transaction';

describe('Sales Receipt Routes', () => {
  let agent: SuperTest<Test>;
  let salesHeaderId: string;
  let salesDebitTransactionId: string;
  let salesCreditTransactionId: string;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    if (salesHeaderId) {
      // await SalesDebitTransaction.destroy({
      //   where: {
      //     salesHeaderId,
      //   },
      // });
      // await SalesCreditTransaction.destroy({
      //   where: {
      //     salesHeaderId,
      //   },
      // });
      // await SalesHeader.destroy({
      //   where: {
      //     id: salesHeaderId,
      //   },
      // });
    }
    await stopServer();
  });

  // Test cases for createSalesHeader function
  it('should return 200 with the created sales header data on success', async () => {
    const res = await agent
      .post('/sales-receipt/header')
      .send(headerRequestBody)
      .expect(200);

    salesHeaderId = res.body.data.id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated sales header data on success', async () => {
    const updateRequestBody = {
      salesHeaderId,
      ...headerRequestBody,
    };

    const res = await agent
      .post('/sales-receipt/header')
      .send(updateRequestBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for createSalesDebitTransaction function
  it('should return 200 with the created sales debit transaction data on success', async () => {
    const debitBody = {
      salesHeaderId,
      ...debitRequestBody,
    };
    const res = await agent
      .post('/sales-receipt/debit')
      .send(debitBody)
      .expect(200);

    salesDebitTransactionId = res.body.data[0].id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated sales debit transaction data on success', async () => {
    const debitBody = {
      salesHeaderId,
      salesDebitTransactionId,
      ...debitRequestBody,
    };

    const res = await agent
      .post('/sales-receipt/debit')
      .send(debitBody)
      .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  // Test cases for createSalesDebitTransaction function
  it('should return 200 with the created sales credit transaction data on success', async () => {
    const creditBody = {
      salesHeaderId,
      ...creditRequestBody,
    };

    const res = await agent
      .post('/sales-receipt/credit')
      .send(creditBody)
      .expect(200);

    salesCreditTransactionId = res.body.data[0].id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return 200 with the updated sales credit transaction data on success', async () => {
    const creditBody = {
      salesHeaderId,
      salesCreditTransactionId,
      ...creditRequestBody,
    };

    const res = await agent
      .post('/sales-receipt/credit')
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
      .post('/sales-receipt/update/status')
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
      .post('/sales-receipt/update/status')
      .send({ salesHeaderId })
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
      .post('/sales-receipt/transaction-reverse')
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
      salesHeaderId,
      debitTransactionIds: [salesDebitTransactionId],
      creditTransactionIds: [salesCreditTransactionId],
    };
    const res = await agent
      .post('/sales-receipt/transaction-reverse')
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
