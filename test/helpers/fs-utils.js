'use strict';

var fs = require('fs');

var stack = [process.cwd()];

module.exports = {
  pushd: function (path, callback) {
    fs.stat(path, function (err, stats) {
      if (err) {
        return callback(err);
      }

      if (!stats.isDirectory()) {
        return callback(new Error(path + ' is not a directory'));
      }

      stack.push(process.cwd());

      process.chdir(path);

      return callback();
    });
  },
  popd: function (callback) {
    process.chdir(stack.length > 1 ? stack.pop() : stack[0]);
  },
  clean: function (path, ignores, callback) {
    if (typeof path !== 'string') {
      callback = ignores;
      ignores  = path;
      path     = process.cwd();
    }

    if (typeof ignores === 'function') {
      callback = ignores;
      ignores  = ['.gitkeep'];
    }

    fs.readdir(path, function (error, files) {
      if (error) {
        return callback(error);
      }

      files.forEach(function (file) {
        if (ignores.indexOf(file) === -1) {
          fs.unlinkSync(file);
        }
      });

      return callback();
    });
  },
  copy: function (source, target, callback) {
    var input  = fs.createReadStream(source);
    var output = fs.createWriteStream(target);

    input.on('error', callback);
    output.on('error', callback);
    output.on('close', callback);

    input.pipe(output);
  },
  compare: function (fileA, fileB, callback) {
    fs.readFile(fileA, {encoding: 'utf8'}, function (err, contentA) {
      if (err) {
        return callback(err);
      }

      fs.readFile(fileB, {encoding: 'utf8'}, function (err, contentB) {
        if (err) {
          return callback(err);
        }

        return callback(null, contentA === contentB);
      });
    });
  }
}