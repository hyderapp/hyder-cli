const { red } = require('chalk');
const moment = require('moment');
const { log, table } = require('../utils/out');
const request = require('../utils/request');


exports.list = async name => {
  const url = `/admin/products/${name}/rollouts`;
  const rollouts = await request({ url });
  if (!rollouts) {
    log(`product ${red(name)} not exists`);
    return;
  }

  rollouts.reverse();

  const info = rollouts.map(o => {
    const time = moment(o.done_at).format('YYYY-MM-DD HH:mm:ss');
    console.log(o);
    return {
      version: o.target_version,
      policy: o.policy,
      status: o.status,
      time
    };
  });

  table(info);
};


exports.create = () => {
  console.log('rollout create');
};
