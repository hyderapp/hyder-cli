const { bgGreen, red, black } = require('chalk');
const { log } = require('../../utils/out');
const request = require('../../utils/request');


exports.build = require('./build');
exports.upload = require('./upload');


exports.list = async(name, opts) => {
  const url = `/admin/products/${name}/packages`;
  const data = { namespace: opts.namespace };
  const pkgs = await request({ url, data });
  if (!pkgs) {
    log(`product ${red(name)} not exists`);
    return;
  }

  const info = pkgs
    .reverse()
    .map(pkg => {
      return pkg.online ? bgGreen(black(pkg.version)) : pkg.version;
    })
    .join('\n');

  log(info);
};

