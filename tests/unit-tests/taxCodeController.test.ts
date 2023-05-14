import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import MESSAGE from '../../src/config/message.json';
import { CODE, SUCCESS } from '../../src/config/response';
import checkResponsePropertiesExist, { checkResponseBodyValue } from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';

describe('Tax code Routes', () => {
  let agent: SuperTest<Test>;

  beforeAll(async () => {
    if (!sharedAgent.agent) {
      sharedAgent.agent = await loginUser();
    }
    agent = sharedAgent.agent;
  });

  afterAll(async () => {
    await stopServer();
  })

  it('should return tax codes when authenticated', async () => {
   const res = await agent
    .get('/tax-codes')
    .expect(200);
    
    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res, 
        CODE[200], 
        SUCCESS.TRUE, 
        MESSAGE.FETCHED)
    ).toEqual(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});