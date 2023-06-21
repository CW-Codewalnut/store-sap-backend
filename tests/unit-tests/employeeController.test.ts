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

describe('Employee Routes', () => {
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

  it('should return employee list by plant Id', async () => {
    const res = await agent
      .get('/employees/j_zwJnKLy7leIpel')
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("Return a list of employees who haven't created a user yet", async () => {
    const res = await agent
      .get('/employees')
      .query({ search: 'SBPL - 001' })
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return paginated employee list when authenticated', async () => {
    const res = await agent
      .get('/employees/paginate')
      .query({ page: '1', pageSize: '10', search: 'SBPL - 001' })
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
      .get('/employees/paginate')
      .query({ pageSize: '10', search: '' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });

  it('should return bad request if pageSize query param not supplied', async () => {
    const res = await agent
      .get('/employees/paginate')
      .query({ page: '1', search: '' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });

  it('should return bad request if search query param not supplied', async () => {
    const res = await agent
      .get('/employees/paginate')
      .query({ page: '1', pageSize: '10' })
      .expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });
});
