const main = require('./index');


test('product <command> [options...]', () => {
  const list = jest.fn();
  cmd('product list', list);
  expect(list).toHaveBeenCalled();

  const get = jest.fn();
  cmd('product get shop', get);
  const name = get.mock.calls[0][0];
  expect(name).toBe('shop');
});


test('package <command> [options...]', () => {
  const build = jest.fn();
  cmd('package build', build);
  expect(build).toHaveBeenCalled();
});


test('rollout <command> [options...]', () => {
  const create = jest.fn();
  cmd('rollout create', create);
  expect(create).toHaveBeenCalled();
});


test('rollback --product <name>', () => {
  const rollback = jest.fn();
  cmd('rollback --product shop', rollback, 'default', 'rollback');
  expect(rollback).toHaveBeenCalled();
  const opts = rollback.mock.calls[0][0];
  expect(opts.product).toBe('shop');
});


test('show help', () => {
  const fn = jest.spyOn(global.console, 'log');

  const msgs = [];
  fn.mockImplementation(msg => {
    msgs.push(msg);
  });

  cmd('--help', null, 'default');

  expect(fn).toHaveBeenCalled();
  fn.mockRestore();

  expect(msgs.join('\n')).toMatch(/Examples/);
});


function cmd(str, fn, scope, name) {
  const argv = str.split(/\s+/);
  scope = scope || argv[0];
  name = name || argv[1];
  const defines = {
    [scope]: {
      [name]: fn
    }
  };
  main(argv, defines);
}
