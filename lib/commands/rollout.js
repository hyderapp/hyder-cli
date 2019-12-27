const moment = require('moment');
const { red, blue } = require('chalk');
const { log, error, table } = require('../utils/out');
const request = require('../utils/request');
const confirm = require('../utils/confirm');


exports.list = async(name, opts) => {
  const url = `/admin/products/${name}/rollouts`;
  const rollouts = await request({ url });
  if (!rollouts) {
    log(`product ${red(name)} not exists`);
    return;
  }

  const { limit = 20 } = opts;
  rollouts.reverse();

  const info = rollouts
    .reverse()
    .slice(rollouts.length - limit)
    .map(o => {
      const time = moment(o.done_at).format('YYYY-MM-DD HH:mm:ss');
      return {
        version: o.target_version,
        policy: o.policy,
        status: o.status,
        time
      };
    });

  table(info);
};


exports.update = async(name, opts) => {
  const url = `/admin/products/${name}/rollouts`;
  const version = opts.V;

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
    log(res);
  } else {
    error(res);
  }
};

