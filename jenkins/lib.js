const path = require('path');
const { createHash } = require('crypto');
const { readFileSync } = require('fs');
const { spawn } = require('child_process');

const { hashPersonalMessage, ecsign, toBuffer, addHexPrefix } = require('ethereumjs-util');

const genCommitFilename = (name, version, commit, buildId) => {
  const split = name.split(version);
  return `${split[0]}${version}-${commit}-${buildId}${split[1]}`;
};

const genFileList = (linux, windows, osx) => {
  const { platform } = process;
  if (platform === 'linux') {
    return [...linux, ...windows];
  } else if (platform === 'darwin') {
    return [...osx];
  } else {
    throw new Error('Unrecognized host platform.');
  }
};

const genSha512 = filePath => {
  const hash = createHash('sha512');
  const data = readFileSync(filePath);
  hash.update(data);
  return hash.digest('hex');
};

const runChildProcess = cmd =>
  new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', cmd]);

    child.stdout.on('data', data => {
      process.stdout.write(data);
    });

    child.stderr.on('data', data => {
      process.stderr.write(data);
    });

    child.on('close', code => {
      if (code !== 0) {
        return reject(`Child process exited with code: ${code}`);
      }
      resolve();
    });
  });

const uploadToS3 = (localFilePath, s3FilePath) =>
  runChildProcess(`aws s3 cp "${localFilePath}" "${s3FilePath}"`);

const genS3Url = (filename, commit, bucket) => `s3://${bucket}/${commit}/${filename}`;

const genManifestFile = manifest =>
  manifest.map(info => ({
    Filename: info.commitFilename,
    SHA512: info.fileHash
  }));

const genManifestFilename = (flavor, version, commit, buildId) =>
  `manifest.${flavor}.v${version}.${commit}.${buildId}.json`;

const genSignatureFile = (manifestHash, pKeyString) => {
  const pKeyBuffer = Buffer.from(pKeyString, 'hex');
  return signMessageWithPrivKeyV2(pKeyBuffer, manifestHash);
};

const genSignatureFilename = (flavor, version, commit, buildId) =>
  `manifest.${flavor}.v${version}.${commit}.${buildId}.signature`;

const genManifest = (fileList, version, jenkinsBuildId, gitCommit, gitCommitShort, s3Bucket) =>
  fileList.map(filename => {
    const fullPath = path.resolve('dist/electron-builds/', filename);
    const commitFilename = genCommitFilename(filename, version, gitCommitShort, jenkinsBuildId);

    return {
      fullPath,
      filename,
      commitFilename,
      fileHash: genSha512(fullPath),
      s3Url: genS3Url(commitFilename, gitCommit, s3Bucket)
    };
  });

function signMessageWithPrivKeyV2(privKey, msg) {
  const hash = hashPersonalMessage(toBuffer(msg));
  const signed = ecsign(hash, privKey);
  const combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  const combinedHex = combined.toString('hex');

  return addHexPrefix(combinedHex);
}

module.exports = {
  genCommitFilename,
  genManifestFile,
  genFileList,
  genSha512,
  genS3Url,
  uploadToS3,
  signMessageWithPrivKeyV2,
  genManifestFilename,
  genManifest,
  genSignatureFile,
  genSignatureFilename
};
