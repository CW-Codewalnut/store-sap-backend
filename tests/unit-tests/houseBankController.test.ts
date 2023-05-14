import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import { CODE, SUCCESS } from '../../src/config/response';
import MESSAGE from '../../src/config/message.json';
import checkResponsePropertiesExist, { checkResponseBodyValue } from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';

describe('House Bank Routes', () => {
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

  it('should return house bank list when authenticated', async () => {
    const res = await agent
      .get('/house-banks')
      .expect(CODE[200]);

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
