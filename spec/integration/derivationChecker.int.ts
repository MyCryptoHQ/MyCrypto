import { exec } from 'child_process';
import { default as Wallet } from 'ethereumjs-wallet';

import { stripHexPrefix } from '@services';

// FIXME pick a less magic number
const derivationRounds = 500;
const dockerImage = 'dternyak/eth-priv-to-addr';
const dockerTag = 'latest';

function promiseFromChildProcess(command: string): Promise<any> {
  return new Promise((resolve, reject) => {
    return exec(command, (err: Error, stdout: string) => {
      err ? reject(err) : resolve(stdout);
    });
  });
}

function getCleanPrivateKey(privKeyWallet: Wallet): string {
  return stripHexPrefix(privKeyWallet.getPrivateKeyString());
}

function makeCommaSeparatedPrivateKeys(privKeyWallets: Wallet[]): string {
  const privateKeys = privKeyWallets.map(getCleanPrivateKey);
  return privateKeys.join(',');
}

async function privToAddrViaDocker(privKeyWallets: Wallet[]): Promise<string> {
  const command = `docker run -e key=${makeCommaSeparatedPrivateKeys(
    privKeyWallets
  )} ${dockerImage}:${dockerTag}`;
  const dockerOutput = await promiseFromChildProcess(command);
  const newlineStrippedDockerOutput = dockerOutput.replace(/(\r\n|\n|\r)/gm, '');
  return newlineStrippedDockerOutput;
}

function makeWallets(): Wallet[] {
  const wallets: Wallet[] = [];
  let i = 0;
  while (i < derivationRounds) {
    const privKeyWallet = Wallet.generate();
    wallets.push(privKeyWallet);
    i += 1;
  }
  return wallets;
}

async function getNormalizedAddressFromWallet(wallet: Wallet): Promise<string> {
  const privKeyWalletAddress = await wallet.getAddressString();
  // strip checksum
  return privKeyWalletAddress.toLowerCase();
}

async function getNormalizedAddressesFromWallets(wallets: Wallet[]): Promise<string[]> {
  return Promise.all(wallets.map(getNormalizedAddressFromWallet));
}

async function testDerivation(): Promise<true> {
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
    return testDerivation().then(expect);
  });
});
