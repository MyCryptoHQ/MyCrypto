import PrivKeyWallet from './libs/wallet/privkey';
import assert from 'assert';
const { exec } = require('child_process');

// FIXME pick a less magic number
const derivationRounds = 5000;

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

const testDerivation = numberOfTimes => {
  for (let i = 0; i < numberOfTimes; i++) {
    const privKeyWallet = PrivKeyWallet.generate();
    const command = `docker run -e key=${privKeyWallet.getPrivateKey()} dternyak/eth-priv-to-addr:1.0`;
    privKeyWallet.getAddress().then(privKeyWalletAddress => {
      exec(command, (err, stdout) => {
        const newlineStrippedDockerOutput = stdout.replace(
          /(\r\n|\n|\r)/gm,
          ''
        );
        // strip the checksum
        const lowerCasedPrivKeyWalletAddress = privKeyWalletAddress.toLowerCase();
        // ensure that pyethereum privToAddr derivation matches our (js) derivation
        assert.strictEqual(
          newlineStrippedDockerOutput,
          lowerCasedPrivKeyWalletAddress
        );
      });
    });
    wait(1);
  }
};

console.log('Starting testing...');
console.time('testDerivation');
testDerivation(derivationRounds);
console.timeEnd('testDerivation');
console.log(`Succeeded testing derivation ${derivationRounds} times :)`);
process.exit(0);
