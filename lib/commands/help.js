const debug = require('debug')('hyder/help');
const out = require('../utils/out');
const version = require('../../package.json').version;

exports.index = (name, opts) => {
  debug('show help: %s, %o', name, opts);
  if (opts.version) {
    out(`Hyder CLI: ${version}`);
    return;
  }
  out('hyder --version');
};
