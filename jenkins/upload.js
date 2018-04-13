const path = require('path');
const { writeFileSync } = require('fs');

const {
  VERSION,
  FLAVOR,
  GIT_COMMIT,
  GIT_COMMIT_SHORT,
  LINUX_FILES,
  WINDOWS_FILES,
  OSX_FILES,
  S3_BUCKET,
  JENKINS_BUILD_ID,
  ETH_SIGNING_KEY,
  IS_CODE_SIGNING
} = require('./constants');

const {
  genSha512,
  genFileList,
  genCommitFilename,
  genS3Url,
  genManifest,
  genManifestFile,
  genManifestFilename,
  genSignatureFile,
  genSignatureFilename,
  uploadToS3
} = require('./lib');

const fileList = genFileList(WINDOWS_FILES, LINUX_FILES, OSX_FILES);

const manifest = genManifest(
  fileList,
  VERSION,
  JENKINS_BUILD_ID,
  GIT_COMMIT,
  GIT_COMMIT_SHORT,
  S3_BUCKET,
  IS_CODE_SIGNING
);

const manifestFile = genManifestFile(manifest);
const manifestFilename = genManifestFilename(FLAVOR, VERSION, GIT_COMMIT_SHORT, JENKINS_BUILD_ID);
const manifestFilePath = path.resolve(`./${manifestFilename}`);
const manifestS3Url = genS3Url(manifestFilename, GIT_COMMIT, S3_BUCKET);

// write manifest file
writeFileSync(manifestFilename, JSON.stringify(manifestFile, null, 2), 'utf8');

const manifestHash = genSha512(manifestFilePath);

const signatureFile = genSignatureFile(manifestHash, ETH_SIGNING_KEY);
const signatureFilename = genSignatureFilename(FLAVOR, VERSION, GIT_COMMIT_SHORT, JENKINS_BUILD_ID);
const signatureFilePath = path.resolve(`./${signatureFilename}`);
const signatureS3Url = genS3Url(signatureFilename, GIT_COMMIT, S3_BUCKET);

// write signature file
writeFileSync(signatureFilePath, signatureFile, 'utf8');

// upload all the things to S3
(async () => {
  for (let fileInfo of manifest) {
    const { fullPath, s3Url } = fileInfo;
    await uploadToS3(fullPath, s3Url);
  }

  await uploadToS3(manifestFilePath, manifestS3Url);
  await uploadToS3(signatureFilePath, signatureS3Url);
})();
