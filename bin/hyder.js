#!/usr/bin/env node

const minimist = require('minimist');
const main = require('../lib/index');


process.title = 'hyder/cli';

const argv = minimist(process.argv.slice(2));
const { _: [name = 'help', action = 'index', param], ...opts } = argv;
main(name, action, param, opts);
