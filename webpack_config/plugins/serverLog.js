'use strict';
const chalk = require('chalk');

// this plugin if for loggin url after each time the compilation is done.
module.exports = class LogPlugin {
  constructor(port) {
    this.port = port;
  }

  apply(compiler) {
    const protocol = process.env.HTTPS ? 'https' : 'http';
    compiler.plugin('done', () => {
      console.log(
        `> App is running at ${chalk.yellow(
          `${protocol}://localhost:${this.port}`
        )}\n`
      );
    });
  }
};
