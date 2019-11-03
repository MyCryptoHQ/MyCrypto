'use strict';
const chalk = require('chalk');

const LogPlugin = function(port) {
  this.port = port;
  this.protocol = process.env.HTTPS ? 'https' : 'https';
};

LogPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', (compiler, done) => {
    console.log(
      `> App is running at ${chalk.yellow(
        `${this.protocol}://localhost:${this.port}`
      )}\n`
    );
  });
};

module.exports = LogPlugin;
