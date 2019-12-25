const prompts = require('prompts');


module.exports = async function confirm(message, argv) {
  argv = argv || process.argv.slice(2);
  if (argv.indexOf('-y') !== -1) {
    return true;
  }

  const res = await prompts({
    type: 'text',
    name: 'confirm',
    message: `${message} Y/n`
  });
  return res.confirm && res.confirm.toUpperCase() === 'Y';
};
