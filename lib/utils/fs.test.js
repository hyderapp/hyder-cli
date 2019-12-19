const pathUtil = require('path');
const { isDir, listFiles } = require('./fs');


const fixtureDir = pathUtil.join(__dirname, '__test__/fixture');


test('isDir', () => {
  expect(isDir(fixtureDir)).toBe(true);
  expect(isDir(pathUtil.join(fixtureDir, 'not-exist'))).toBe(false);
});


test('listFiles', () => {
  const files = listFiles(fixtureDir);
  console.log(files);
});

