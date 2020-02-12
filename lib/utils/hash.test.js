const pathUtil = require('path');
const hashUtil = require('./hash');


test('hash.file', async() => {
  const path = pathUtil.join(__dirname, '__test__/fixture/hash.md');
  const hash = await hashUtil.files([path, path, path]);
  expect(hash.substr(0, 10)).toBe('ce6cba4f25');
});
