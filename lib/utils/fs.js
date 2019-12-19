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
      const isdir = exports.isDir(path);
      if (!filter({ name, path, root, isdir })) {
        return null;
      }

      if (isdir) {
        return listFiles(path, filter, root);
      }

      return path;
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
