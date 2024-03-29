module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  maxWorkers: 1,
  detectOpenHandles: true,
  testTimeout: 10000,
  roots: ['tests'],
  verbose: true,
  coveragePathIgnorePatterns: [
    'src/config/',
    'src/interfaces/',
    'src/migrations',
    'src/models',
    'src/routes',
    'src/typings',
    'tests/mock-data',
    'tests/utils',
  ],
};
