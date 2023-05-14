import request from 'supertest';
import app from '../../src/app';
import { sharedAgent } from './sharedAgent';
import { startServer } from './serverHandler';

const loginUser = async () => {
  await startServer()
  const agent = request.agent(app);
  const requestBody = {
    "employeeCode": "SBPL - 001",
    "password": "1234",
    "lat": "22.033013",
    "long": "82.670290"
  };
  await agent
    .post('/auth')
    .send(requestBody)
    .expect(200);

  await agent
  .get('/plant/selected/j_zwJnKLy7leIpel')
  .expect(200);

  sharedAgent.agent = agent;
  return agent;
};

export default loginUser;
