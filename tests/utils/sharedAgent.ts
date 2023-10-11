import { SuperTest, Test } from 'supertest';

export const sharedAgent = {
  agent: null as SuperTest<Test> | null,
};
