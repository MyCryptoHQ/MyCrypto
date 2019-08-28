import { Account, SecureWalletName } from 'v2/types';

export const accounts: Account[] = [
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    networkId: 'Homestead',
    assets: [
      {
        uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
        balance: '100000000000000',
        mtime: Date.now()
      },
      {
        uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702',
        balance: '100000000000000',
        mtime: Date.now()
      }
    ],
    wallet: SecureWalletName.WEB3,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  },
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    networkId: 'Goerli',
    assets: [
      {
        uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
        balance: '100000000000000',
        mtime: Date.now()
      }
    ],
    wallet: SecureWalletName.WEB3,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  }
];
