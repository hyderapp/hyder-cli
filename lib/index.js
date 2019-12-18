const commander = require('commander');
const debug = require('debug')('hyder/main');
const { log } = require('./utils/out');


const Scope = {
  default: defaultProgram,
  product: productProgram,
  package: packageProgram,
  rollout: rolloutProgram
};


module.exports = function(argv) {
  const rWord = /^\w+$/;
  const [scope, args] =
    argv.length >= 2 && rWord.test(argv[0]) && rWord.test(argv[1]) ?
      [argv[0], argv.slice(1)] : ['default', argv];

  debug('scope: %s, args: %o', scope, args);

  const factory = Scope[scope] || defaultProgram;
  const program = factory();
  program.action(() => {
    program.outputHelp();
  });

  program.parse(['', '', ...args]);
};


function defaultProgram() {
  const program = new commander.Command();
  const version = require('../package.json').version;

  program
    .name('hyder')
    .usage('<command> [options...]')
    .version(version);

  program.on('--help', () => {
    log('');
    log('Examples:');
    log('  $ hyder product list');
    log('  $ hyder product get shop');
    log('  $ hyder rollout --env stg');
  });

  return program;
}


function productProgram() {
  const program = new commander.Command();
  const define = require('./commands/product');

  program.name('hyder product');

  program
    .command('list')
    .description('list products')
    .action(define.list);

  program
    .command('get <name>')
    .action(define.get);

  return program;
}


function packageProgram() {
  return null;
}


function rolloutProgram() {
  return null;
}
