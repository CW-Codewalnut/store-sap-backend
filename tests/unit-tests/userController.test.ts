import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import MESSAGE from '../../src/config/message.json';
import { CODE, SUCCESS } from '../../src/config/response';
import checkResponsePropertiesExist, { checkResponseBodyValue } from '../utils/checkResponsePropertiesExist';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';

describe('User Routes', () => {
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

  it('should return user list when authenticated', async () => {
    const res = await agent
    .get('/users/paginate?page=1&pageSize=10&search=')
    .expect(200);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(
        res, 
        CODE[200], 
        SUCCESS.TRUE, 
        MESSAGE.FETCHED)
    ).toEqual(true);

     // Test if count exists and is a number
     expect(res.body.data).toHaveProperty('count');
     expect(typeof res.body.data.count).toBe('number');
 
     // Test if rows exists and is an array
     expect(res.body.data).toHaveProperty('rows');
     expect(Array.isArray(res.body.data.rows)).toBe(true);
  });
});
