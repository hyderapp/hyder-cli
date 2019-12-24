const pathUtil = require('path');
const fs = require('fs-extra');
const minimatch = require('minimatch');
const debug = require('debug')('hyder:package');
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

  const assetsPath = pathUtil.join(root, config.package.from);
  const files = listFiles(assetsPath, assetsFilter.bind(null, config));
  const items = createOutputItems(assetsPath, files, config);

  debug('output items: %o', items);

  const outdir = pathUtil.resolve(opts.out || 'dist');
  createPackageFile({ config, items, outdir, assetsPath });
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


function assetsFilter(config, { name, path, root }) {
  const rHidden = /^\./;
  if (rHidden.test(name)) {
    return false;
  }

  const rules = config.package.ignore || [];
  const relpath = pathUtil.relative(root, path);
  return !testRules(rules, relpath);
}


function createOutputItems(root, files, config) {
  return files.map(path => {
    const rePath = pathUtil.relative(root, path);
    const newDir = getNewDir(config.package.to, rePath);
    return newDir ? [path, pathUtil.join(newDir, rePath)] : null;
  }).filter(v => v);
}


function getNewDir(to, path) {
  const presets = {
    html: ['*.html', '.htm'],
    assets: ['*.js', '*.json', '*.css', '*.png', '*.jpg', '*.gif'],
    service: ['service*.js']
  };
  const item = Object.entries(to).find(([key]) => {
    const rules = presets[key] || key;
    return testRules(rules, path);
  });
  return item && item[1];
}


function createPackageFile({ config, items, outdir, assetsPath }) {
  const tmpdir = fs.mkdtempSync(pathUtil.join(outdir, `${config.name}-`));
  fs.ensureDirSync(tmpdir);
  items.forEach(([from, to]) => {
    const relFrom = pathUtil.relative(assetsPath, from);
    console.log(`copy ${relFrom} -> ${to}`);
    fs.copySync(from, pathUtil.join(tmpdir, to));
  });
}


function testRules(rules, path) {
  rules = Array.isArray(rules) ? rules : [rules];
  return rules.some(rule => minimatch(path, rule));
}

