'use strict';
const path = require('path');
const packager = require('electron-packager');
const fs = require('fs');
const config = require('../config');

function ElectronPackagerPlugin() {};
ElectronPackagerPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', (stats) => {
    const buildDir = stats.compilation.compiler.outputPath;

    // Packager requires package.json be in the build directory, so copy it in
    fs.copyFileSync(
      path.join(config.path.root, 'package.json'),
      path.join(buildDir, 'package.json')
    );

    // Run electron packager
    console.info('Beginning Electron packager...');
    packager({
      dir: buildDir,
      out: path.join(config.path.output, 'electron-builds'),
      icon: path.join(buildDir, 'favicon'),
      all: true,
      overwrite: true
    }, (err, appPaths) => {
      if (err) {
        throw new Error(err);
      }
      console.info('Finished building Electron apps! You can find them here:');
      appPaths.map((path) => console.info(` * ${path}`));
    });
  });
};

module.exports = ElectronPackagerPlugin;
