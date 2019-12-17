exports.list = (_, opts) => {
  console.log('package list', opts.product);
};

exports.get = (version, opts) => {
  console.log('package.get', version, opts);
};
