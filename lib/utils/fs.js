const pathUtil = require('path');
const fs = require('fs');

const $true = () => true;


exports.isDir = isDir;

exports.listFiles = function(root, filter = $true) {
  return listFiles(root, filter, root);
};


function listFiles(dir, filter = $true, root) {
  const list = fs.readdirSync(dir);
  const files = list
    .map(name => {
      const path = pathUtil.join(dir, name);
      if (exports.isDir(path)) {
        return listFiles(path, filter, root);
      }
      if (filter({ name, path, root })) {
        return path;
      }
      return null;
    })
    .filter(v => v);
  return flatten(files);
}


function isDir(path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory();
}


function flatten(list) {
  return list.reduce((acc, item) => (
    Array.isArray(item) ? acc.concat(item) : [...acc, item]
  ), []);
}
