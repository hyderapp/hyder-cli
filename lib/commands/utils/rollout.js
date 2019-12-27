const { blue } = require('chalk');
const confirm = require('../../utils/confirm');
const request = require('../../utils/request');
const { log, error, table } = require('../../utils/out');


module.exports = async(name, opts) => {
  const url = `/admin/products/${name}/rollouts`;
  const version = opts.V || opts.version;

  log(`rollout package: ${blue(name)}, version: ${blue(version)}`);

  const ok = await confirm(`Are you sure to rollout ${blue(name)}, version: ${blue(version)} ？`);
  if (!ok) {
    return;
  }

  const res = await request({
    url,
    method: 'post',
    data: {
      version
    }
  });

  if (res.success) {
    log(res.data);
  } else {
    error(res.apiMessage);
  }
};

