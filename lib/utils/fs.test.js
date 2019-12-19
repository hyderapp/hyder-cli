const pathUtil = require('path');
const { isDir, listFiles } = require('./fs');


const fixtureDir = pathUtil.join(__dirname, '__test__/fixture');


test('isDir', () => {
  expect(isDir(fixtureDir)).toBe(true);
  expect(isDir(pathUtil.join(fixtureDir, 'not-exist'))).toBe(false);
});


test('listFiles', () => {
  const files = listFiles(fixtureDir);
  expect(files.length > 0).toBe(true);

  const filteredFiles = files.filter(path => pathUtil.extname(path) === '.js');
  const jsFiles = listFiles(fixtureDir, ({ name }) => pathUtil.extname(name) === '.js');
  expect(filteredFiles).toEqual(jsFiles);
});

