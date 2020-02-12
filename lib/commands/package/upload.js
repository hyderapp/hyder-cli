const fs = require('fs');
const pathUtil = require('path');
const { red, blue } = require('chalk');
const ora = require('ora');
const confirm = require('../../utils/confirm');
const request = require('../../utils/request');
const { getPackageInfo } = require('../../utils/product');
const { log, error } = require('../../utils/out');


module.exports = async function upload(path) {
  if (!path) {
    error('param `path` required');
    return;
  }

  if (!fs.existsSync(path)) {
    error(`package ${red(path)} not found`);
    return;
  }

  const filename = pathUtil.basename(path);
  const info = getPackageInfo(path);
  if (!info) {
    error(`invalid package file patten: ${filename}`);
    return;
  }

  const ok = await confirm(`Are you sure to upload package: ${filename}？`);
  if (!ok) {
    error('cancel upload');
    return;
  }

  const success = await doUpload(path, info);
  if (!success) {
    error('upload fail');
  }
};

async function doUpload(path, { name, version }) {
  log(`upload package: ${blue(name)}, version: ${blue(version)}, path: ${path}`);
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
  }).catch(e => {
    return { success: false, message: e.message };
  });

  if (res.success) {
    indicator.succeed('upload success');
  } else {
    indicator.fail(`upload fail: ${res.message}`);
  }

  log(res.data);

  return res.success;
}
