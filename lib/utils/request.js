const urllib = require('urllib');
const minimist = require('minimist');
const { red } = require('chalk');
const { filter } = require('ramda');

const compact = filter(v => v !== null && v !== undefined);


module.exports = async function request({
  env,
  scope,
  url,
  method,
  data,
  files,
  argv
}) {
  const host = getHost({ env, scope });
  url = url.replace(/^\//, '');
  url = `${host}/${url}`;
  method = (method || 'get').toUpperCase();

  data = processData(data, argv);

  const opts = {
    method,
    data,
    files,
    dataType: 'json'
  };
  const { data: res } = await urllib.request(url, opts);

  if (method === 'GET') {
    if (res.success || res.succeess) {
      return res.data;
    }
    console.error(red(res.apiMessage));  // eslint-disable-line
    throw new Error(`request error: ${res.apiMessage}`);
  }
  return res;
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


function processData(data, argv) {
  argv = argv || process.argv.slice(2);
  const args = minimist(argv);
  data = {
    namespace: args.namespace,
    ...data
  };
  return compact({
    namespace: args.namespace,
    ...data
  });
}
