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

describe('Role Routes', () => {
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

  it('should return success with roles', async () => {
    const res = await agent.get('/roles').expect(CODE[200]);
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
});
