const { inspect } = require('util');
const urllib = require('urllib');


module.exports = async function request({ env, scope, url, method, data }) {
  const host = getHost({ env, scope });
  url = url.replace(/^\//, '');
  url = `${host}/${url}`;
  method = (method || 'get').toUpperCase();

  const opts = {
    method,
    data,
    dataType: 'json'
  };
  const { data: res } = await urllib.request(url, opts);
  if (method === 'get') {
    if (res.success) {
      return res.data;
    }
    throw new Error(`request error: ${inspect(res.data)}`);
  }
  return res.data;
};


function getHost({ env, scope = 'hps' }) {
  const host = process.env[`${scope.toUpperCase()}_HOST`];
  if (host) {
    return attachProto(host);
  }
  env = env || process.env.HYDER_ENV || 'prod';
  const prefix = {
    prod: scope
  }[env] || `${env}-${scope}`;
  return attachProto(prefix + '.helijia.com');
}


function attachProto(host) {
  const rHttp = /^https?/;
  return rHttp.test(host) ? host : `https://${host}`;
}
