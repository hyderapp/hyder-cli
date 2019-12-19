const pathUtil = require('path');
const fs = require('fs');
const minimatch = require('minimatch');
const debug = require('debug')('hyder/package');
const { listFiles } = require('../utils/fs');


exports.list = (_, opts) => {
  console.log('package list', opts);
};


exports.get = (version, opts) => {
  console.log('package get', version, opts);
};


exports.build = (root, opts) => {
  root = pathUtil.resolve(root || '.');
  const config = loadConfig(root);
  const outdir = pathUtil.resolve(opts.out || 'dist');

  const assetsPath = pathUtil.join(root, config.package.from);
  const files = listFiles(assetsPath, assetsFilter.bind(null, config));
  console.log(files);
};


function loadConfig(root) {
  const path = pathUtil.join(root, 'package.json');
  const json = fs.readFileSync(path, 'utf-8');
  const info = JSON.parse(json);

  validateConfig(info.hyder);

  return {
    name: info.name,
    version: info.version,
    package: { ...info.hyder }
  };
}


function validateConfig(config) {
  if (!config) {
    throw new Error('hyder config not set');
  }

  if (!config.from || !config.to) {
    throw new Error('invalid hyder config');
  }
}


function assetsFilter(config, { name, path, root })  {
  const rHidden = /^\./;
  if (rHidden.test(name)) {
    return false;
  }

  const rules = config.package.ignore || [];
  const relpath = pathUtil.relative(root, path);
  const ignore = rules.some(rule => minimatch(relpath, rule));
  return !ignore;
}
