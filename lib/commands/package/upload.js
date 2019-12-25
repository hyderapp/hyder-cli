const fs = require('fs');
const pathUtil = require('path');
const { red, blue } = require('chalk');
const prompts = require('prompts');
const { log, error } = require('../../utils/out');


const rPkg = /^(\w+)[-_](\d\.\d\.\d(?:-[-.\w]+)?)\.zip$/;


module.exports = async function upload(path, opts) {
  if (!fs.existsSync(path)) {
    error(`package ${red(path)} not found`);
    return;
  }

  const filename = pathUtil.basename(path);
  const match = rPkg.exec(filename);
  if (!match) {
    error(`invalid package file patten: ${filename}`);
    return;
  }

  const ok = opts.y || await confirm(filename);
  if (!ok) {
    return;
  }

  await doUpload(path, { name: match[1], version: match[2] });
};


async function confirm(filename) {
  const res = await prompts({
    type: 'text',
    name: 'confirm',
    message: `Are you sure to upload ${filename}? Y/n`
  });

  return res.confirm && res.confirm.toUpperCase() === 'Y';
}


function doUpload(path, { name, version }) {
  log(`upload package: ${blue(name)}, version: ${blue(version)}`);
}
