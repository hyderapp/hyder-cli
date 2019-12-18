const debug = require('debug')('hyder/main');

const list = [
  ['help', require('./commands/help')],
  ['package', require('./commands/package')],
  ['product', require('./commands/product')],
  ['rollout', require('./commands/rollout')]
];

const CMD = list.reduce((acc, [name, mod]) => {
  acc[name] = mod;
  return acc;
}, {});

debug('CMD: %o', CMD);

module.exports = function(name, sub, param, opts) {
  debug('run: %s %s %s %o', name, sub, param, opts);
  const obj = CMD[name] || CMD.help;
  const fn = obj[sub] || CMD.help.index;
  fn(param, opts);
};

