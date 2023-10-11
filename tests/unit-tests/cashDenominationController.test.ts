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

describe('Cash Denomination Routes', () => {
  let agent: SuperTest<Test>;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    await stopServer();
  });

  it('should return cash denomination by cash jounal Id', async () => {
    const cashDenomination = {
      id: expect.anything(),
      denominationTotalAmount: expect.any(Number),
      qty1INR: expect.any(Number),
      qty2INR: expect.any(Number),
      qty5INR: expect.any(Number),
      qty10INR: expect.any(Number),
      qty20INR: expect.any(Number),
      qty50INR: expect.any(Number),
      qty100INR: expect.any(Number),
      qty200INR: expect.any(Number),
      qty500INR: expect.any(Number),
      qty2000INR: expect.any(Number),
      cashJournalId: expect.any(String),
      plantId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      createdBy: expect.any(String),
      updatedBy: expect.any(String),
    };

    const res = await agent
      .get('/cash-denomination/o2kHOE6HrgrgaGjH')
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).toEqual(cashDenomination);
  });
});
