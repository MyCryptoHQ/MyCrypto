'use strict';
process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const packager = require('electron-packager');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const prodConfig = require('./webpack.prod.js');

function ElectronPackagerPlugin() {};
ElectronPackagerPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', () => {
    // Packager requires package.json be in the build directory, so copy it in
    fs.copyFileSync(
      path.join(__dirname, '../package.json'),
      path.join(utils.outputPath, 'package.json')
    );

    // Run electron packager
    console.info('Beginning Electron packager...');
    packager({
      dir: utils.outputPath,
      out: 'dist/electron-builds',
      icon: path.join(utils.outputPath, 'favicon'),
      all: true,
      overwrite: true
    }, (err, appPaths) => {
      if (err) {
        throw new Error(err);
      }
      console.info('Finished building Electron apps! You can find them here:');
      appPaths.map((path) => console.info(`    ${path}`));
    });
  });
};

const electronConfig = {
  entry: './electron/main.js',
  target: 'electron-main',
  output: {
    filename: 'main.js',
    path: utils.outputPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  node: {
    __dirname: false,
    __filename: false
  }
};

// HACKY! Add the electron packager plugin to prodConfig, since that takes much
// longer, and needs to run after both are done. Plugin emit hooks don't wait
// for multiple builds. Sure is cool, huh?
prodConfig.plugins.push(new ElectronPackagerPlugin());

module.exports = [prodConfig, electronConfig];
