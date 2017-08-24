import PrivKeyWallet from './libs/wallet/privkey';
import assert from 'assert';
const { exec } = require('child_process');
const ProgressBar = require('progress');

// FIXME pick a less magic number
const derivationRounds = 100;
const bar = new ProgressBar(':percent :bar', { total: derivationRounds });

async function testDerivation() {
  const privKeyWallet = PrivKeyWallet.generate();
  const command = `docker run -e key=${privKeyWallet.getPrivateKey()} dternyak/eth-priv-to-addr:1.0`;
  const privKeyWalletAddress = await privKeyWallet.getAddress();

  return new Promise(function(resolve) {
    return exec(command, (err, stdout) => {
      const newlineStrippedDockerOutput = stdout.replace(/(\r\n|\n|\r)/gm, '');
      // strip the checksum
      const lowerCasedPrivKeyWalletAddress = privKeyWalletAddress.toLowerCase();
      // ensure that pyethereum privToAddr derivation matches our (js based) derivation
      assert.strictEqual(
        newlineStrippedDockerOutput,
        lowerCasedPrivKeyWalletAddress
      );
      resolve();
    });
  });
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
