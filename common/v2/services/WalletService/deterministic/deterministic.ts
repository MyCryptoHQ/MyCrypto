import HDKey from 'hdkey';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import { TokenValue } from 'v2/services/EthService';

export class DeterministicWallet {
  protected address: string;
  protected dPath: string;
  protected index: number;

  constructor(address: string, dPath: string, index: number) {
    this.address = address;
    this.dPath = dPath;
    this.index = index;
  }

  public getAddressString(): string {
    return this.address;
  }

  public getPath(): string {
    return `${this.dPath}/${this.index}`;
  }
}
export interface GetDeterministicWalletsArgs {
  seed?: string;
  dPath: string;
  publicKey?: string;
  chainCode?: string;
  limit: number;
  offset: number;
}

export interface DeterministicWalletData {
  index: number;
  address: string;
  value?: TokenValue;
}

export interface ITokenData {
  value: TokenValue;
  decimal: number;
}

export interface ITokenValues {
  [key: string]: ITokenData | null;
}

export const getDeterministicWallets = (
  args: GetDeterministicWalletsArgs
): DeterministicWalletData[] => {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  let pathBase;
  let hdk;

  // if seed present, treat as mnemonic
  // if pubKey & chainCode present, treat as HW wallet
  if (seed) {
    hdk = HDKey.fromMasterSeed(new Buffer(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = new Buffer(publicKey, 'hex');
    hdk.chainCode = new Buffer(chainCode, 'hex');
    pathBase = 'm';
  } else {
    return [];
  }
  const wallets: DeterministicWalletData[] = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    wallets.push({
      index,
      address: toChecksumAddress(address)
    });
  }
  return wallets;
};
