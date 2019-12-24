const get = require('lodash.get');
const request = require('../utils/request');
const { log, table } = require('../utils/out');


exports.list = async() => {
  const products = await request({ url: '/admin/products' });
  const list = products.map(product => {
    return {
      name: product.name,
      title: product.title,
      online: get(product, 'online_packages[0].version')
    };
  });
  table(list);
};


exports.get = name => {
  log(name);
};
