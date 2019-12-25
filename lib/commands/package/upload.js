const fs = require('fs');
const pathUtil = require('path');
const { red, blue } = require('chalk');
const ora = require('ora');
const confirm = require('../../utils/confirm');
const request = require('../../utils/request');
const { log, error } = require('../../utils/out');


const rPkg = /^(\w+)[-_](\d\.\d\.\d(?:-[-.\w]+)?)\.zip$/;


module.exports = async function upload(path) {
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

  const ok = await confirm(`Are you sure to upload package: ${filename}？`);
  if (!ok) {
    return;
  }

  await doUpload(path, { name: match[1], version: match[2] });
};

async function doUpload(path, { name, version }) {
  log(`upload package: ${blue(name)}, version: ${blue(version)}`);
  const indicator = ora({
    text: 'uploading'
  });

  indicator.start();

  const res = await request({
    method: 'post',
    url: `/admin/products/${name}/packages`,
    files: {
      archive: path
    },
    data: {
      version
    }
  });

  if (res.success) {
    indicator.succeed('upload success');
  } else {
    indicator.fail('upload fail');
  }

  log(res.data);
}

