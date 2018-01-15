'use strict';
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const builder = require('electron-builder');
const config = require('../config');

function ElectronBuilderPlugin() {};
ElectronBuilderPlugin.prototype.apply = function(compiler) {
  const electronBuildsDir = path.join(config.path.output, 'electron-builds');

  compiler.plugin('before-run', (params, done) => {
    rimraf(electronBuildsDir, () => done());
  });

  compiler.plugin('done', (stats) => {
    const buildDir = stats.compilation.compiler.outputPath;
    const compression = 'store';

    // Builder requires package.json be in the app directory, so copy it in
    fs.copyFileSync(
      path.join(config.path.root, 'package.json'),
      path.join(buildDir, 'package.json')
    );

    // Ethereum-blockies does not resolve, therefore
    process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = true;

    builder.build({
      mac: ['zip', 'dmg'],
      win: ['nsis'],
      linux: ['AppImage'],
      config: {
        appId: 'com.github.myetherwallet.myetherwallet',
        productName: 'MyEtherWallet',
        directories: {
          app: buildDir,
          output: electronBuildsDir,
        },
        mac: {
          category: 'public.app-category.finance',
          icon: path.join(config.path.electron, 'icons/icon.icns'),
          compression
        },
        win: {
          icon: path.join(config.path.electron, 'icons/icon.ico'),
          compression
        },
        linux: {
          category: 'Finance',
          compression
        },
        publish: {
          provider: 'github',
          owner: 'wbobeirne',
          repo: 'MyEtherWallet-electron',
          vPrefixedTagName: false
        }
      },
    }).then(() => {
      console.info('');
      console.info(`Electron builds are finished! Available at ${buildDir}`);
    }).catch((error) => {
      console.error('Webpack Builder failed!');
      console.error(error);
      throw error;
    });
  });
};

module.exports = ElectronBuilderPlugin;
