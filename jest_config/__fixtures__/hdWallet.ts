import { DWAccountDisplay, ExtendedDPath } from '@services/WalletService/deterministic';
import { TAddress } from '@types';

import { fAccount } from './account';

const addressToTestWith = fAccount.address as TAddress;

export const fExtendedDPath: ExtendedDPath = {
  name: 'Ledger (ETH)',
  path: "m/44'/60'/0'",
  offset: 0,
  numOfAddresses: 1
};

export const fDWAccountDisplayPreBalance: DWAccountDisplay = {
  address: addressToTestWith,
  pathItem: {
    baseDPath: fExtendedDPath,
    path: "m/44'/60'/0'/0",
    index: 0
  }
};

export const fDWAccountDisplay: DWAccountDisplay = {
  ...fDWAccountDisplayPreBalance,
  balance: '0'
};
