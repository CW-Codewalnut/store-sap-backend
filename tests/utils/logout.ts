import { SuperTest, Test } from 'supertest';

const logoutUser = async (agent: SuperTest<Test>) =>
  agent.get('/logout').expect(200);

export default logoutUser;
