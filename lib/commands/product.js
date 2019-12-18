const { log } = require('../utils/out');


exports.list = () => {
  log('show list');
};


exports.get = name => {
  log(name);
};
