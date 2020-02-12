const moment = require('moment');
const { red } = require('chalk');
const { log, error, table } = require('../utils/out');
const request = require('../utils/request');
const confirm = require('../utils/confirm');


exports.update = require('./utils/rollout');


exports.list = async(name, opts) => {
  const url = `/admin/products/${name}/rollouts`;
  const rollouts = await request({ url });
  if (!rollouts) {
    log(`product ${red(name)} not exists`);
    return;
  }

  const { limit = 50 } = opts;
  rollouts.reverse();

  const info = rollouts
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


exports.delete = async name => {
  const ok = await confirm(`Are you sure to rollback ${red(name)} ？`);
  if (!ok) {
    error('cancel rollback');
    return;
  }

  const url = `/admin/products/${name}/rollout`;
  const res = await request({ method: 'DELETE', url });
  if (res.success) {
    log('rollback success');
  } else {
    error(res.apiMessage);
  }
};
