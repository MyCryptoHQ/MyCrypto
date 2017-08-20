import PrivKeyWallet from './libs/wallet/privkey';

const assert = require('assert');
const { exec } = require('child_process');
const n = 5000;

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

function keyToDockerCommand(key) {
  return `docker run -e key=${key} dternyak/eth-priv-to-addr:1.0`;
}

// or at least different 2 times
const testPrivateKeysAreRandom = () => {
  const privKeyWallet1 = PrivKeyWallet.generate();
  assert.ok(privKeyWallet1.getPrivateKey());
  const privKeyWallet2 = PrivKeyWallet.generate();
  assert.ok(privKeyWallet2.getPrivateKey());
  assert.notDeepEqual(
    privKeyWallet2.getPrivateKey(),
    privKeyWallet1.getPrivateKey()
  );
};

const testDerivation = n => {
  for (let i = 0; i < n; i++) {
    const privKeyWallet = PrivKeyWallet.generate();
    privKeyWallet.getAddress().then(data => {
      const privKeyWalletAddress = data;
      assert.ok(privKeyWallet.getPrivateKey());
      const command = keyToDockerCommand(privKeyWallet.getPrivateKey());
      exec(command, (err, stdout, stderr) => {
        const newlineStrippedDockerOutput = stdout.replace(
          /(\r\n|\n|\r)/gm,
          ''
        );
        assert.strictEqual(
          newlineStrippedDockerOutput,
          privKeyWalletAddress.toLowerCase()
        );
      });
    });
    wait(1);
  }
};

console.log('Starting testing...');
console.time('testDerivation');
testPrivateKeysAreRandom();
testDerivation(n);
console.timeEnd('testDerivation');
console.log(`Succeeded testing derivation ${n} times :)`);
process.exit(0);
