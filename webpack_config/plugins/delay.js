'use strict';

const DelayPlugin = function (delayMs) {
  this.delayMs = delayMs;
};

DelayPlugin.prototype.apply = function (compiler) {
  compiler.plugin('before-run', (compiler, done) => {
    setTimeout(() => {
      done();
    }, this.delayMs);
  });
};

module.exports = DelayPlugin;
