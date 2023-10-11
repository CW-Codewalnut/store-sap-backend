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

describe('Customer Routes', () => {
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

  it('should return paginated customer list when authenticated', async () => {
    const res = await agent
      .get('/customers/paginate')
      .query({ page: '1', pageSize: '10', search: '1086854' })
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

  it('should return bad request if page query param not supplied', async () => {
    const res = await agent
      .get('/customers/paginate')
      .query({ pageSize: '10', search: '' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });

  it('should return bad request if pageSize query param not supplied', async () => {
    const res = await agent
      .get('/customers/paginate')
      .query({ page: '1', search: '' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });

  it('should return bad request if search query param not supplied', async () => {
    const res = await agent
      .get('/customers/paginate')
      .query({ page: '1', pageSize: '10' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });
});
