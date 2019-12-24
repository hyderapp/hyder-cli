const get = require('lodash.get');
const request = require('../utils/request');
const { red } = require('chalk');
const { log, table } = require('../utils/out');


exports.list = async() => {
  const products = await request({ url: '/admin/products' });
  const info = products.map(productView);
  table(info);
};


exports.get = async name => {
  const product = await request({ url: `/admin/products/${name}` });
  if (!product) {
    log(`product ${red(name)} not exists`);
    return;
  }

  const info = productView(product);
  table(info);
};


function productView(product) {
  return {
    name: product.name,
    title: product.title,
    online: get(product, 'online_packages[0].version')
  };
}
