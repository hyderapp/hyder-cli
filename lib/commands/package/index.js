const { bgGreen, red, black } = require('chalk');
const { log } = require('../../utils/out');
const request = require('../../utils/request');

exports.build = require('./build');


exports.list = async(name, version) => {
  let url = `/admin/products/${name}/packages`;
  url = version ? `${url}/${version}` : url;
  const pkgs = await request({ url });
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
