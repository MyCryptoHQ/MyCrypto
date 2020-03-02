// IIFE
(function() {

  'use strict';
  
  // node
  var fs = require('fs');
  var path = require('path');
  
  // Patch encoding module due to iconv issues -> make it use iconv-lite
  (function() {
    var PATCH_VERSION = '0.1.12';
    var PATCH_MODULE = 'encoding';
    var PATCH_REASON = 'Use iconv-lite instead of iconv, helpful for webpack bundling';
    console.log('patching `%s`(%s) module', PATCH_MODULE, PATCH_VERSION);
    var pathToModule = path.join(__dirname, 'node_modules', PATCH_MODULE);
    var pathToModulePackage = path.join(pathToModule, 'package.json');
    var pathToModulePatchedFile1 = path.join(pathToModule, 'lib/iconv-loader.js');
    var pathToModulePatchedFile2 = path.join(pathToModule, 'lib/encoding.js');
    var moduleInfo = require(pathToModulePackage);
    if (moduleInfo.version !== PATCH_VERSION) {
      console.error(
        'patching `encoding` failed - expected `%s` but detected `%s`',
        PATCH_VERSION,
        moduleInfo.version
      );
      process.exit(1);
    }
    var contents;
    if (fs.existsSync(pathToModulePatchedFile1)) {
      contents = [
        '\'use strict\';',
        'module.exports = require(\'iconv-lite\');',
        '',
      ].join('\n');
      fs.writeFileSync(pathToModulePatchedFile1, contents);
    } else {
      console.error('patching `%s` failed because the file does not exist in', PATCH_MODULE, pathToModule);
      process.exit(1);
    }
    if (fs.existsSync(pathToModulePatchedFile2)) {
      contents = fs.readFileSync(pathToModulePatchedFile2).toString();
      contents = contents.replace('console.error(E);','');
      fs.writeFileSync(pathToModulePatchedFile2, contents);
    } else {
      console.error('patching `%s` failed because the file does not exist in', PATCH_MODULE, pathToModule);
      process.exit(1);
    }
    console.log('patching `%s`, reason: `%s` - completed', PATCH_MODULE, PATCH_REASON);
  })();
  
  })(this);