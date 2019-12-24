const console = global.console;  // eslint-disable-line


exports.log = (...args) => {
  console.log(...args);
};


exports.table = data => {
  if (typeof console.table === 'function') {
    console.table(data);
  } else {
    console.log(data);
  }
};
