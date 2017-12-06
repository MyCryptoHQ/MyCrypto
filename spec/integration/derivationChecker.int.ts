import { generate, IFullWallet } from 'ethereumjs-wallet';
const { exec } = require('child_process');

// FIXME pick a less magic number
const derivationRounds = 500;
const dockerImage = 'dternyak/eth-priv-to-addr';
const dockerTag = 'latest';
// const bar = new ProgressBar(':percent :bar', { total: derivationRounds });
const range = n => Array.from(Array(n).keys());

function promiseFromChildProcess(command): Promise<any> {
  return new Promise((resolve, reject) => {
    return exec(command, (err, stdout) => {
      err ? reject(err) : resolve(stdout);
    });
  });
}

function getHexStripped(value: string) {
  return value.replace('0x', '');
}

function getCleanPrivateKey(privKeyWallet: IFullWallet) {
  return getHexStripped(privKeyWallet.getPrivateKeyString());
}

function makeCommaSeparatedPrivateKeys(privKeyWallets: IFullWallet[]) {
  const privateKeys = privKeyWallets.map(getCleanPrivateKey);
  return privateKeys.join(',');
}

async function privToAddrViaDocker(privKeyWallets: IFullWallet[]) {
  const command = `docker run -e key=${makeCommaSeparatedPrivateKeys(
    privKeyWallets
  )} ${dockerImage}:${dockerTag}`;
  const dockerOutput = await promiseFromChildProcess(command);
  const newlineStrippedDockerOutput = dockerOutput.replace(/(\r\n|\n|\r)/gm, '');
  return newlineStrippedDockerOutput;
}

function makeWallets(): IFullWallet[] {
  const wallets: IFullWallet[] = [];
  range(derivationRounds).forEach(() => {
    const privKeyWallet = generate();
    wallets.push(privKeyWallet);
  });
  return wallets;
}

async function getNormalizedAddressFromWallet(wallet: IFullWallet) {
  const privKeyWalletAddress = await wallet.getAddressString();
  const lowerCasedPrivKeyWalletAddress = privKeyWalletAddress.toLowerCase();
  return lowerCasedPrivKeyWalletAddress;
}

async function getNormalizedAddressesFromWallets(wallets: IFullWallet[]) {
  return Promise.all(wallets.map(getNormalizedAddressFromWallet));
}

async function testDerivation() {
  const wallets = makeWallets();
  const walletAddrs = await getNormalizedAddressesFromWallets(wallets);
  const dockerAddrsCS = await privToAddrViaDocker(wallets);
  const dockerAddrs = dockerAddrsCS.split(',');
  expect(walletAddrs).toEqual(dockerAddrs);
  return true;
}

describe('Derivation Checker', () => {
  beforeEach(() => {
    // increase timer to prevent early timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  it(`should derive identical addresses ${derivationRounds} times`, () => {
    return testDerivation().then(success => {
      expect(success);
    });
  });
});
