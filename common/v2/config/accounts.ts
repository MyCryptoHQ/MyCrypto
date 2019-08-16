import { Account, SecureWalletName } from 'v2/types';

export const accounts: Account[] = [
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    networkId: 'Homestead',
    assets: [
      {
        uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
        balance: '0.01',
        timestamp: Date.now()
      }
    ],
    wallet: SecureWalletName.WEB3,
    balance: '0.01',
    dPath: `m/44'/60'/0'/0/0`,
    timestamp: 0,
    transactions: []
  },
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    networkId: 'Goerli',
    assets: [],
    wallet: SecureWalletName.WEB3,
    balance: '0.01',
    dPath: `m/44'/60'/0'/0/0`,
    timestamp: 0,
    transactions: []
  }
];
