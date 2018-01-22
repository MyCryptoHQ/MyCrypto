'use strict';
const rimraf = require('rimraf');

function ClearDistPlugin() {};
ClearDistPlugin.prototype.apply = function(compiler) {
  compiler.plugin('before-run', (params, done) => {
    rimraf(params.outputPath, () => done());
  });
};

module.exports = ClearDistPlugin;
