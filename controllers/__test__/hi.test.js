const sayHello = require('../../utils/hi');

test('string returning hello there jest', () => {
  expect(sayHello()).toMatch('hello there jest');
});
