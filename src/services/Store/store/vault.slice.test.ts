import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { decrypt as decryptData, hashPassword } from '@utils';

import { importState } from './root.reducer';
import {
  decrypt,
  decryptError,
  decryptionWorker,
  initialState,
  default as slice
} from './vault.slice';

const reducer = slice.reducer;
const { clearEncryptedData } = slice.actions;

describe('Vault Slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('clearEncryptedData(): resets state', () => {
    const actual = reducer(initialState, clearEncryptedData());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
});

const password = 'password1234';
const hashedPassword = hashPassword(password);
const wrongPassword = 'bla';
const encryptedData =
  '9d6bac0e4873d30b2cd0d734f60c0e05b4195f71bd67e7ca43d3e9b35d317a8750e6c234a99d0ea871597315e6d156ea8d74655238bde7cbe21c3657e3af16bb89bebf23e847a2386c6c39c24dff458e63f0e955a961b831da43505c37815b12e0395af5ba2ef85c777cf1bbfb20ee329d76dac9612935849a5dee0be8dd06506741edf2d06e060d531cb34faed209b9033420482a68c15e8f0df4417e45d1da354298c887f7b67223ba824268785ced819cc1fd9b4b694533da2b93d047d2eb346e152f52313d7c3fb3248f3499f96cbcabc870eb2e4f9a071913ef27d570c73886778ed6f7fec2643b22c1a5e0c03b770e1ecf96837e567f7b6c6bbf3a273302bcbd35b23bffd81d553033d8d7920a3bcce7bca941a4cd136503022586f10d964c32eb914650c9a6f4ca20ab65f1d4ad97eb6214f29cc3ec71d8d3998768bd058e4b21d832340d314f6057657c3f60832f48fc0291621fea0d31c05113e759845241f28fe178249f1bbcea99b670efc467d4f536b00bd6665c6a9984ae6b42f5c4ab69682e24e9f12c05fa4e9292a75aff5f8f9cbf6ff9bce2afcfe1976dae368a63d56d63d6d3cc524ddce8c7c6038f3fadf728e19487f39df776bd71074d45af5afe647ff6e51f547aa6de0bfbc13ba726e46d578734b4e597d399fd1873ab9605d061de67c2c791145ebc43eb34cf8a2a841c0d0d556a02bc47e3c720fd9828760b92e38ea0a511eb12ece78f40849b61382da42e8068755a400f0c2a369585c32884c6e44d7a057107e32a9cdcb29552cc62a49d1e5ebefc7d31241e3602a8efe2600bbf2c2a07941e4d5e4f9b0e8ee686a269af469fb5cdd0ee553dc3d834da477e6b1858096c38b08fa00273eae5aed5365ecb6e944f87e1b2526bf3c4a154743a6e90628a4ad8714b92e0dbd284d35aa5f1b61d1e1e809fbdd8dcb5b73e4147d121d0f9195b7856103b2f0f6d7db89b9f28e47cc3dd9c19';
const decryptedData = {
  version: 'v1.0.0',
  mtime: 1608048741382,
  accounts: {},
  addressBook: {
    'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
      label: 'MyCrypto Team Tip Jar',
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      notes: "This is MyCrypto's Donate address. Feel free to delete it!",
      network: 'Ethereum',
      uuid: 'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe'
    }
  },
  assets: {},
  rates: {},
  trackedAssets: {},
  contracts: {},
  networks: {},
  notifications: {},
  settings: {
    fiatCurrency: 'USD',
    darkMode: false,
    dashboardAccounts: [],
    excludedAssets: [],
    language: 'en',
    isDemoMode: false,
    canTrackProductAnalytics: true
  },
  password: 'b9c950640e1b3740e98acb93e669c65766f6670dd1609ba91ff41052ba48c6f3',
  networkNodes: {},
  userActions: {}
};

Date.now = jest.fn(() => 1616082016780);

describe('decryptionWorker()', () => {
  it('decrypts existing state and imports', () => {
    return expectSaga(decryptionWorker, decrypt(hashedPassword))
      .withState({
        vault: {
          data: encryptedData
        }
      })
      .call(decryptData, encryptedData, hashedPassword)
      .put(clearEncryptedData())
      .put(importState(JSON.stringify(decryptedData)))
      .silentRun();
  });

  it('goes into error state if password is wrong', () => {
    return expectSaga(decryptionWorker, decrypt(wrongPassword))
      .withState({
        ...mockAppState({ networks: fNetworks, assets: fAssets, accounts: fAccounts }),
        vault: {
          data: encryptedData
        }
      })
      .call(decryptData, encryptedData, wrongPassword)
      .put(decryptError())
      .silentRun();
  });
});
