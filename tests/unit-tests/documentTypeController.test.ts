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
import { DOCUMENT_TYPE_RESPONSE_MOCK } from '../mock-data/documentTypeResponseMock';

describe('Document Type Routes', () => {
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

  it('should return document types by business transaction Id', async () => {
    const res = await agent
      .get('/document-types/cLbQAmZsBihyrL9T')
      .expect(CODE[200]);

    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return document types "KR" and "KG"', async () => {
    const res = await agent.get('/expenses/document-types').expect(CODE[200]);
    expect(checkResponsePropertiesExist(res)).toEqual(true);
    expect(
      checkResponseBodyValue(res, CODE[200], SUCCESS.TRUE, MESSAGE.FETCHED),
    ).toEqual(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining(DOCUMENT_TYPE_RESPONSE_MOCK),
    );
  });
});
