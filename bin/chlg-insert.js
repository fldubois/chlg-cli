'use strict';

var program = require('commander');

var chlgInsert = require('../lib/chlg-insert');

program
  .usage('[options] <section> <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 2) {
  console.error('usage: chlg insert [options] <section> <message>');
  process.exit(1);
}

chlgInsert(program.args.shift(), program.args.join(' '), {file: program.file}, function (err) {
  if (err) {
    console.error('chlg-insert: ' + err.message);
    process.exit(1);
  }
});
