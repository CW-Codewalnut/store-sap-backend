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

describe('Business Transaction Routes', () => {
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

  it('should return business transaction by module Id', async () => {
    const res = await agent
      .get('/business-transactions/wXTGoHB4nMHvvcV9')
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return specified masters data by module Id', async () => {
    const masterList = {
      businessTransactions: expect.any(Array),
      glAccounts: expect.any(Array),
      taxCodes: expect.any(Array),
      houseBanks: expect.any(Array),
      bankAccounts: expect.any(Array),
      plants: expect.any(Array),
    };

    const res = await agent
      .get('/get-all-masters/wXTGoHB4nMHvvcV9')
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).toEqual(masterList);
  });
});
