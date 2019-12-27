const commander = require('commander');
const debug = require('debug')('hyder/main');
const { log } = require('./utils/out');
const { loadConfig } = require('./utils/product');


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
  if (process.env.NODE_ENV === 'test') {
    program._exit = code => {  // eslint-disable-line
      console.log(`exit ${code}`);  // eslint-disable-line
    };
  }
  program.parse(['node.js', 'hyder.js', ...args]);
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


function defaultProgram() {
  const program = new commander.Command();
  const version = require('../package.json').version;

  program
    .name('hyder')
    .usage('<command> [options...]')
    .version(version);

  program.action(() => {
    program.outputHelp();
  });

  program.on('--help', () => {
    log('');
    log('Examples:');

    log('  $ hyder product list');
    log('  $ hyder product info shop');

    log('');
    log('  $ hyder package list shop');
    log('  $ hyder package build');
    log('  $ hyder package upload ./dist/shop-2.8.2-ef51.zip');
    log('  $ hyder package release');

    log('');
    log('  $ hyder rollout list shop');
    log('  $ hyder rollout update shop -V 1.0.0');

    log('');
    log('  $ hyder release');
  });

  return program;
}


function productProgram(define) {
  const program = new commander.Command();
  program.name('hyder product');

  program
    .command('list')
    .option('--namespace <namespace>')
    .action(define.list);

  program
    .command('info [product]')
    .option('--namespace <namespace>')
    .action(withName(define.get));

  return program;
}


function packageProgram(define) {
  const program = new commander.Command();
  program.name('hyder package');

  program
    .command('list [product]')
    .option('--limit <limit>')
    .option('--namespace <namespace>')
    .action(withName(define.list));

  program
    .command('build [path]')
    .option('-o, --out <path>')
    .action(define.build);

  program
    .command('upload [path]')
    .option('--namespace <namespace>')
    .option('-y')
    .action(define.upload);

  program
    .command('release [path]')
    .option('--namespace <namespace>')
    .option('-y')
    .action(define.release);

  return program;
}


function rolloutProgram(define) {
  const program = new commander.Command();
  program.name('hyder rollout');

  program
    .command('list [product]')
    .option('--limit <limit>')
    .option('--namespace <namespace>')
    .action(withName(define.list));

  program
    .command('update [product]')
    .requiredOption('-V <version>')
    .option('--namespace <namespace>')
    .option('-y')
    .action(withName(define.update));

  return program;
}


function withName(fn) {
  return (name, ...args) => {
    if (!name) {
      const info = loadConfig(process.cwd());
      name = info && info.name;
    }
    if (!name) {
      throw new Error('product name required');
    }
    return fn(name, ...args);
  };
}
