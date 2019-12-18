const commander = require('commander');
const debug = require('debug')('hyder/main');
const { log } = require('./utils/out');


const Scope = {
  default: defaultProgram,
  product: productProgram,
  package: packageProgram,
  rollout: rolloutProgram
};


const Defines = {
  default: require('./commands/default'),
  package: require('./commands/package'),
  product: require('./commands/product'),
  rollout: require('./commands/rollout')
};


module.exports = function(argv, defines = Defines) {
  const [scope, args] = parseArgv(argv, defines);
  debug('scope: %s, args: %o', scope, args);

  const factory = Scope[scope];
  const program = factory(defines[scope]);
  program.parse(['', '', ...args]);
};


/**
 * parse argv
 *
 * Exp:
 *  product list... -> ['product', ['list'...]]
 *  product -> ['product', ['--help']]
 *  else: -> ['default', args]
 */
function parseArgv(argv, defines) {
  const [scope, args] = argv.length >= 1 && defines[argv[0]] ?
    [argv[0], argv.slice(1)] : ['default', argv.slice()];
  if (args.length === 0) {
    args.push('--help');
  }
  return [scope, args];
}


function defaultProgram(define) {
  const program = new commander.Command();
  const version = require('../package.json').version;

  program
    .name('hyder')
    .usage('<command> [options...]')
    .version(version);

  program
    .command('rollback')
    .requiredOption('-p, --product <name>')
    .action(define.rollback);

  program.action(() => {
    program.outputHelp();
  });

  program.on('--help', () => {
    log('');
    log('Examples:');

    log('  $ hyder product list');
    log('  $ hyder product get shop');

    log('');
    log('  $ hyder package build');
    log('  $ hyder package list --product shop');
    log('  $ hyder package get 1.0.0 --product shop');

    log('  $ hyder rollout create');
    log('  $ hyder rollout list --product shop');

    log('  $ hyder rollback --product shop');
  });

  return program;
}


function productProgram(define) {
  const program = new commander.Command();
  program.name('hyder product');

  program
    .command('list')
    .action(define.list);

  program
    .command('get <name>')
    .action(define.get);

  return program;
}


function packageProgram(define) {
  const program = new commander.Command();
  program.name('hyder package');

  program
    .command('list')
    .requiredOption('-p, --product <name>')
    .action(define.list);

  program
    .command('get <version>')
    .requiredOption('-p, --product <name>')
    .action(define.get);

  program
    .command('build')
    .action(define.build);

  return program;
}


function rolloutProgram(define) {
  const program = new commander.Command();
  program.name('hyder rollout');

  program
    .command('list')
    .action(define.list);

  program
    .command('get <version>')
    .requiredOption('-p, --product <name>')
    .action(define.get);

  return program;
}
