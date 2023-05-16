// eslint-disable-next-line import/no-extraneous-dependencies
const sonarqubeScanner = require('sonarqube-scanner');
const configs = require('./src/config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

sonarqubeScanner(
  {
    serverUrl: 'https://sonar.codewalnut.com/',
    token: config.sonarToken,
    options: {
      'sonar.sources': 'src',
      'sonar.exclusions': '**/*.test.ts',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.tests': 'test',
      'sonar.test.inclusions': 'test/**/*.test.ts', // Test files
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info', // LCOV coverage file (you should generate this file with a test runner like Jest)
      'sonar.projectKey': 'store-sap-backend',
      'sonar.projectName': 'store-sap-backend',
      'sonar.organization': 'codewalnut',
      'sonar.projectVersion': '1.0.0',
      'sonar.token': config.sonarToken,
    },
  },
  () => process.exit(),
);
