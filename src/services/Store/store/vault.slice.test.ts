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
  '9d6bac0e4873d30b2cd0d734f60c0e05b4195f71bd67e7ca43d3e9b35d317b8950eac833ac9a0aa873597315e6d156ea8d74655238bde7cbe21c3657e3af16bb89bebf23e847a2386c6c39c24dff458e63f0e955a961b831da43505c37815b12e0395af5ba2ef85c777cf1bbfb20ee329d76dac9612935849a5dee0be8dd06506741edf2d06e060d531cb34faed209b9033420482a68c15e8f0df4417e45d1da354298c887f7b67223ba824268785ced819cc1fd9b4b694533da2b93d047d2eb346e152f52313d7c3fb3248f3499f96cbcabc870eb2e4f9a071913ef27d570c73886778ed6f7fec2643b22c1a5e0c03b770e1ecf96837e567f7b6c6bbf3a273302bcbd35b23bffd81d553033d8d7920a3bcce7bca941a4cd136503022586f10d964c32eb914650c9a6f4ca20ab65f1d4ad97eb6214f29cc3ec71d8d3998768bd058e4b21d832340d314f6057657c3f60832f48fc0291621fea0d31c05113e759845241f28fe178249f1bbcea99b670efc467d4f536b00bd6665c6a9984ae6b42f5c4ab69682e24e9f12c05fa4e9292a75aff5f8f9cbf6ff9bce2afcfe1976dae368a63d56d63d6d3cc524ddce8c7c6038f3fadf728e19487f39df776bd71074d45af5afe647ff6e51f547aa6de0bfbc13ba726e46d578734b4e597d399fd1873ab9605d061de67c2c791145ebc43eb34cf8a2a841c0d0d556a02bc47e3c720fd9828760b92e38ea0a01ee416edef9e4cd2d817342ee370803b37261552535769ddc28d738cc0fd5f784c715ea021a68cffd450ef54ae940470a5d9767272012307b8f9ec781cac371b08d95f566f4e871d94f796c13dec48dfa29d86ad413387cf70dd09657d585c43272ebc9ffd132cfeb1aed5395ecc6e9619d4e6e75138a3c5f25d75396ccb6adf49da7642c4e48c8486dd5fa5a1b20f5658dfccf996d1a6e54148458063c2f6504435405d2b7c1b1f3ce0d09e23e32996d48a2a6a34fe612102460c240978367c9e096e82894dedbe720f8b8faa';
const decryptedData = {
  version: 'v1.0.0',
  mtime: 1616082016780,
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
