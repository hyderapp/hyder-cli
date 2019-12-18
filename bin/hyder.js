#!/usr/bin/env node

const main = require('../lib/index');

process.title = 'hyder/cli';

main(process.argv.slice(2));
