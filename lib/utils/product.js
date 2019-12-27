const pathUtil = require('path');
const fs = require('fs');


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


exports.loadPackageInfo = function(path) {

};
