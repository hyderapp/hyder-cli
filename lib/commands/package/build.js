const pathUtil = require('path');
const fs = require('fs-extra');
const minimatch = require('minimatch');
const archiver = require('archiver');
const debug = require('debug')('hyder:build');
const { listFiles } = require('../../utils/fs');
const hashUtil = require('../../utils/hash');
const { log } = require('../../utils/out');


module.exports = async(root, opts) => {
  root = pathUtil.resolve(root || '.');
  const config = loadConfig(root);

  const assetsPath = pathUtil.join(root, config.package.from);
  const files = listFiles(assetsPath, assetsFilter.bind(null, config));
  const items = createOutputItems(assetsPath, files, config);

  debug('output items: %o', items);

  const outdir = pathUtil.resolve(opts.out || 'dist');
  await createPackageFile({ config, items, outdir, assetsPath });
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


async function createPackageFile({ config, items, outdir, assetsPath }) {
  const tmpdir = fs.mkdtempSync(pathUtil.join(outdir, `${config.name}-`));
  log('create package files: ');
  fs.ensureDirSync(tmpdir);
  items.forEach(([from, to]) => {
    const relFrom = pathUtil.relative(assetsPath, from);
    log(`  ${relFrom} -> ${to}`);
    fs.copySync(from, pathUtil.join(tmpdir, to));
  });

  const hash = await hashUtil.files(items.map(o => o[0]));

  const pkgName = `${config.name}-${config.version}-${hash.substr(0, 4)}.zip`;

  log(`Compress Files: ${pkgName}`);
  log(pkgName);

  await zip(tmpdir, pathUtil.join(outdir, pkgName));

  fs.removeSync(tmpdir);
}


function zip(src, des) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(des);
    const archive = archiver('zip');
    archive.on('error', reject);
    output.on('error', reject);
    output.on('close', resolve);

    archive.pipe(output);
    archive
      .directory(src, false)
      .finalize();
  });
}


function testRules(rules, path) {
  rules = Array.isArray(rules) ? rules : [rules];
  return rules.some(rule => minimatch(path, rule));
}
