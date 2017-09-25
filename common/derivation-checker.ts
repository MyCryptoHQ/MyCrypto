import assert from 'assert';
import PrivKeyWallet from './libs/wallet/privkey';
const { exec } = require('child_process');
const ProgressBar = require('progress');

// FIXME pick a less magic number
const derivationRounds = 100;
const dockerImage = 'dternyak/eth-priv-to-addr';
const dockerTag = 'latest';
const bar = new ProgressBar(':percent :bar', { total: derivationRounds });

function promiseFromChildProcess(command): Promise<any> {
  return new Promise((resolve, reject) => {
    return exec(command, (err, stdout) => {
      err ? reject(err) : resolve(stdout);
    });
  });
}

async function privToAddrViaDocker(privKeyWallet) {
  const command = `docker run -e key=${privKeyWallet.getPrivateKey()} ${dockerImage}:${dockerTag}`;
  const dockerOutput = await promiseFromChildProcess(command);
  const newlineStrippedDockerOutput = dockerOutput.replace(
    /(\r\n|\n|\r)/gm,
    ''
  );
  return newlineStrippedDockerOutput;
}

async function testDerivation() {
  const privKeyWallet = PrivKeyWallet.generate();
  const privKeyWalletAddress = await privKeyWallet.getAddress();
  const dockerAddr = await privToAddrViaDocker(privKeyWallet);
  // strip the checksum
  const lowerCasedPrivKeyWalletAddress = privKeyWalletAddress.toLowerCase();
  // ensure that pyethereum privToAddr derivation matches our (js based) derivation
  assert.strictEqual(dockerAddr, lowerCasedPrivKeyWalletAddress);
}

async function testDerivationNTimes(n = derivationRounds) {
  let totalRounds = 0;
  while (totalRounds < n) {
    await testDerivation();
    bar.tick();
    totalRounds += 1;
  }
}

console.log('Starting testing...');
console.time('testDerivationNTimes');
testDerivationNTimes().then(() => {
  console.timeEnd('testDerivationNTimes');
  console.log(`Succeeded testing derivation ${derivationRounds} times :)`);
  process.exit(0);
});
