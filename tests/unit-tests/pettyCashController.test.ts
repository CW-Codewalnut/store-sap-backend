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

describe('Petty Routes', () => {
  let agent: SuperTest<Test>;
  let pettyCashId: string;
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

  afterEach(async () => {
    if (pettyCashId) {
      await PettyCash.destroy({
        where: {
          id: pettyCashId,
        },
      });
    }

    if (pettyCashCreatedId) {
      await PettyCash.destroy({
        where: {
          id: pettyCashCreatedId,
        },
      });
    }
  });

  it('should return a 400 error due to a missing required property', async () => {
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
    await PettyCash.destroy({where: {documentStatus: 'Saved'}});
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

  it('should return app payment transaction between dates when authenticated', async () => {
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

  it('should return app receipt transaction between dates when authenticated', async () => {
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

  test('should return a bad request error if required data is missing', async () => {
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

  test('should return a success for balance calculation', async () => {
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
});
