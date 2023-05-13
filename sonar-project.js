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
      'sonar.tests': 'test',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.test.inclusions': 'test/**/*.test.js', // Test files
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info', // LCOV coverage file (you should generate this file with a test runner like Jest)
      'sonar.testExecutionReportPaths': 'reports/test-report.xml', // Test report file (JUnit formatted)
      'sonar.projectKey': 'store-sap-backend',
      'sonar.projectName': 'store-sap-backend',
      'sonar.organization': 'codewalnut',
      'sonar.projectVersion': '1.0.0',
      'sonar.login': config.sonarToken,
    },
  },
  () => {},
);
