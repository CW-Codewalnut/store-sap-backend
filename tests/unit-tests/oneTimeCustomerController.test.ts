import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import { CODE, SUCCESS } from '../../src/config/response';
import MESSAGE from '../../src/config/message.json';
import checkResponsePropertiesExist, {
  checkResponseBodyValue,
} from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';
import { requestBody } from '../mock-data/oneTimeCustomerMock';
import { headerRequestBody } from '../mock-data/saleHeaderMock';
import OneTimeCustomer from '../../src/models/one-time-customer';
import SalesHeader from '../../src/models/sales-header';

describe('One Time Customer Routes', () => {
  let agent: SuperTest<Test>;
  let oneTimeCustomerId: string;
  let salesHeaderId: string;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    if (salesHeaderId) {
      await OneTimeCustomer.destroy({
        where: {
          salesHeaderId,
        },
      });
      await SalesHeader.destroy({
        where: {
          id: salesHeaderId,
        },
      });
    }
    await stopServer();
  });

  it('should return success and create one time customer', async () => {
    const saleHeaderData = await agent
      .post('/sales-receipt/header')
      .send(headerRequestBody)
      .expect(200);

    salesHeaderId = saleHeaderData.body.data.id;

    const createRequestBody = {
      salesHeaderId,
      ...requestBody,
    };

    const res = await agent
      .post('/one-time-customer')
      .send(createRequestBody)
      .expect(CODE[200]);

    oneTimeCustomerId = res.body.data.id;

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });

  it('should return success and update one time customer', async () => {
    const updateRequestBody = {
      oneTimeCustomerId,
      salesHeaderId,
      ...requestBody,
    };
    const res = await agent
      .post('/one-time-customer')
      .send(updateRequestBody)
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).not.toEqual(MESSAGE.NULL);
  });
});
