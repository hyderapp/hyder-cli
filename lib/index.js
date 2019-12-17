const debug = require('debug')('hyder/main');
const out = require('./utils/out');
const version = require('../package.json').version;


const CMD = {
  help: {
    index: showHelp
  }
};


module.exports = (name, sub, opts) => {
  debug('run: %s %s %o', name, sub, opts);
  const cmd = CMD[name] && CMD[name][sub] || CMD.help.index;
  cmd(sub, opts);
};


function showHelp(name, opts) {
  if (opts.version) {
    out(`Hyder CLI: ${version}`);
    return;
  }
  out('hyder --version');
}
