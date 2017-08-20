const PrivKeyWallet = require('../common/libs/wallet/privkey');

const exec = require('child_process').exec;
function execute(command, callbackOut, callbackErr) {
  exec(command, function(error, stdout, stderr) {
    if (stdout) callbackOut(stdout);
    else if (stderr) console.log(stderr); //callbackErr(stderr)
  });
}

const n = 5000;

function keyToDockerCommand(key) {
  return `docker run -e key=${key} dternyak/eth-priv-to-addr:1.0`;
}

describe('PrivKeyWallet', () => {
  it('.generate should construct with random privkey', () => {
    const privKeyWallet1 = PrivKeyWallet.generate();
    expect(privKeyWallet1.getPrivateKey()).toBeTruthy();
    const privKeyWallet2 = PrivKeyWallet.generate();
    expect(privKeyWallet2.getPrivateKey()).toBeTruthy();
    expect(
      privKeyWallet2.getPrivateKey() === privKeyWallet1.getPrivateKey()
    ).toBeFalsy();
  });

  it(`.generate should derive address in similar fashion as pyethereum (via docker) ${n} times`, () => {
    for (let i = 0; i < n; i++) {
      const privKeyWallet = PrivKeyWallet.generate();
      privKeyWallet.getAddress().then(data => {
        const privKeyWalletAddress = data;
        expect(privKeyWallet.getPrivateKey()).toBeTruthy();
        const command = keyToDockerCommand(privKeyWallet.getPrivateKey());

        const callBack = stdout => {
          console.log(stdout);
          expect(stdout).toEqual(privKeyWalletAddress);
        };

        execute(command, callBack);
      });
    }
  });
});
