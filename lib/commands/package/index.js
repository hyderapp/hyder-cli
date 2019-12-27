const { bgGreen, red, black } = require('chalk');
const { log, error } = require('../../utils/out');
const request = require('../../utils/request');
const { deducePackageInfo } = require('../../utils/product');
const rollout = require('../utils/rollout');
const build = require('./build');
const upload = require('./upload');


exports.build = build;
exports.upload = upload;


exports.list = async(name, opts) => {
  const url = `/admin/products/${name}/packages`;
  const pkgs = await request({ url });
  if (!pkgs) {
    log(`product ${red(name)} not exists`);
    return;
  }

  const { limit = 50 } = opts;
  const info = pkgs
    .reverse()
    .slice(pkgs.length - limit)
    .map(pkg => {
      return pkg.online ? bgGreen(black(pkg.version)) : pkg.version;
    })
    .join('\n');

  log(info);
};


exports.release = async path => {
  path = path || process.cwd();
  const info = deducePackageInfo(path);
  if (!info) {
    error('no package to release');
    return;
  }

  await upload(info.path);
  await rollout(info.name, { version: info.version });
};
