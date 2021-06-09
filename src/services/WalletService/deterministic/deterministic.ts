import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';

import { TAddress } from '@types';
import { TokenValue } from '@utils';

export class HDWallet {
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
export interface GetHDWalletsArgs {
  seed?: string;
  dPath: string;
  publicKey?: string;
  chainCode?: string;
  limit: number;
  offset: number;
}

export interface HDWalletData {
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

export const getHDWallets = (args: GetHDWalletsArgs): HDWalletData[] => {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  let pathBase;
  let hdk;

  // if seed present, treat as mnemonic
  // if pubKey & chainCode present, treat as HW wallet
  if (seed) {
    hdk = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = Buffer.from(publicKey, 'hex');
    hdk.chainCode = Buffer.from(chainCode, 'hex');
    pathBase = 'm';
  } else {
    return [];
  }
  const wallets: HDWalletData[] = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    wallets.push({
      index,
      address: toChecksumAddress(address) as TAddress
    });
  }
  return wallets;
};
