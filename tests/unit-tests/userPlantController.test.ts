import 'jest';
import { SuperTest, Test } from 'supertest';

import loginUser from '../utils/login';
import { CODE, SUCCESS } from '../../src/config/response';
import MESSAGE from '../../src/config/message.json';
import { sharedAgent } from '../utils/sharedAgent';
import { stopServer } from '../utils/serverHandler';

describe('User Plant Routes', () => {
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

  it('should update selected plant successfully', async () => {
    const res = await agent
      .get('/plant/selected/j_zwJnKLy7leIpel')
      .expect(CODE[200]);

    expect(res.body.status).toBe(CODE[200]);
    expect(res.body.success).toBe(SUCCESS.TRUE);
    expect(res.body.message).toBe(MESSAGE.SUCCESS);
    expect(res.body.data).toBeNull();
  });

  it('should return a bad request error when supplied invalid plant Id', async () => {
    const res = await agent.get('/plant/selected/1234').expect(CODE[400]);

    expect(res.body.status).toBe(CODE[400]);
    expect(res.body.success).toBe(SUCCESS.FALSE);
    expect(res.body.message).toBe(MESSAGE.BAD_REQUEST);
    expect(res.body.data).toBeNull();
  });
});
