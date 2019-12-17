const debug = require('debug')('hyder/main');


module.exports = (name, sub, opts) => {
  debug('run: %s %s %o', name, sub, opts);
};

