const VERSION = require('../package.json').version;
const GIT_COMMIT = process.env.GIT_COMMIT || 'commit-not-set';
const GIT_COMMIT_SHORT = GIT_COMMIT.substring(0, 7);
const JENKINS_BUILD_ID = process.env.BUILD_ID;
const LINUX_FILES = [`MyCrypto-${VERSION}-i386.AppImage`, `MyCrypto-${VERSION}-x86_64.AppImage`];
const WINDOWS_FILES = [`MyCrypto Setup ${VERSION}.exe`, `MyCrypto Setup ${VERSION}.exe.blockmap`];
const OSX_FILES = [];
const FLAVOR = (() => {
  const { platform } = process;

  if (platform === 'linux') {
    return 'linux-windows';
  } else if (platform === 'darwin') {
    return 'mac';
  } else {
    throw new Error('Unsupported platform.');
  }
})();
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const ETH_SIGNING_KEY = process.env.ETH_SIGNING_KEY;

module.exports = {
  VERSION,
  GIT_COMMIT,
  GIT_COMMIT_SHORT,
  JENKINS_BUILD_ID,
  LINUX_FILES,
  WINDOWS_FILES,
  OSX_FILES,
  FLAVOR,
  S3_BUCKET,
  ETH_SIGNING_KEY
};
