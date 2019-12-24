const pathUtil = require('path');
const hashUtil = require('./hash');


test('hash.file', async() => {
  const path = pathUtil.join(__dirname, '__test__/fixture/hash.md');
  const hash = await hashUtil.file(path);
  expect(hash.substr(0, 10)).toBe('101113c05a');
});
