const pathUtil = require('path');
const fs = require('fs');
const { listFiles } = require('./fs');


exports.loadConfig = function(root, { assert } = {}) {
  const path = pathUtil.join(root, 'package.json');
  if (!fs.existsSync(path)) {
    if (assert) {
      throw new Error('invalid package');
    }
    return null;
  }

  const json = fs.readFileSync(path, 'utf-8');
  const info = JSON.parse(json);

  assert && validateConfig(info.hyder);

  return {
    name: info.name,
    version: info.version,
    package: { ...info.hyder }
  };
};


function validateConfig(config) {
  if (!config) {
    throw new Error('hyder config not set');
  }

  if (!config.from || !config.to) {
    throw new Error('invalid hyder config');
  }
}


exports.deducePackageInfo = function(root) {
  const dist = pathUtil.join(root, 'dist');
  const files = listFiles(dist, o => !o.isdir);
  const list = files.map(path => {
    const stats = fs.statSync(path);
    const info = exports.getPackageInfo(path);
    return { info, mtime: stats.mtime, path };
  }).filter(o => o.info);

  list.sort((left, right) => {
    return left.mtime.getTime() <= right.mtime.getTime() ? -1 : 1;
  });
  const last = list.pop();
  return last && last.info;
};


exports.getPackageInfo = function(path) {
  const rPkg = /^(\w+)[-_](\d+\.\d+\.\d+(?:-[-.\w]+)?)\.zip$/;
  const filename = pathUtil.basename(path);
  const match = rPkg.exec(filename);
  if (!match) {
    return null;
  }
  return { name: match[1], version: match[2], path };
};
