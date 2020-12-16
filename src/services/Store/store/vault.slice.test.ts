import { expectSaga } from 'test-utils';

import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { decrypt as decryptData, encrypt as encryptData, hashPassword } from '@utils';

import { marshallState } from '../DataManager/utils';
import { importState } from './reducer';
import {
  decrypt,
  decryptionWorker,
  encrypt,
  encryptionWorker,
  initialState,
  default as slice
} from './vault.slice';

const reducer = slice.reducer;
const { setEncryptedData, clearEncryptedData } = slice.actions;

describe('Vault Slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setEncryptedData(): sets data to payload', () => {
    const actual = reducer(initialState, setEncryptedData('encrypted'));
    const expected = { data: 'encrypted' };
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
const encryptedData =
  '9d6bac0e4873d30b2cd0d734f60c0e05b4195f71bd67e7ca43d3e9b35d317a8750e6c234a99d0ea871597315e6d156ea8d74655238bde7cbe21c3657e3af16bb89bebf23e847a2386c6c39c24dff458e63f0e955a961b831da43505c37815b12e0395af5ba2ef85c777cf1bbfb20ee329d76dac9612935849a5dee0be8dd06506741e1e39d0433160110db4fb89457fe112366006d2bca48d74da17c08178589154498c7f3a5b3077ec882616b2f559fa6bfc2f0e83e483366de2de6a314d0ff2979497004786c306ae5159365d0fb4da7e2da70e13206b95f784db439c46b9724d458c382b4cfd32c3f34c0a2e891647b5b2dc397cd64126c2f6828ad6461654ae0eb79e736a3ce5841312886d1d55066dcb8ffa35ad68d1a3617027296ae0d965834f1901019c9fdbed66fef37f888f4d5b93950ac8b9bf33ad9c8c7812fe7589e1433ca3178447c5b685d33682425c22f4fe6088b621fea0d31c05112e35995480daf87be6e7dc90fb4e8869061dcc571dfe23cb00b8f4e230cd8c7e27b51e6cc92752e717daebb6f07ec5fc9dfb150ff15d788a331bf93eeb8c9f2907abc60d957e6326389d0d2121acbe8d7f319923daaa630a0edbcb6deea5ba96001415da557a50a34ced329546cb5825ab99a46f86ea33d0c9530abb4c884c6b55b6ca29a0dc472dd43839edc045eea4de52ce4b675d50e1a1c5d3d5cfb419bd76aaddc6d6001ac8fc0b1fe44b510a0be8946c498703875b03bc1373329135405516fc6d08576d391b8077d486a55e422fc9fe3c30bfe71ffc1080bac8e317c6a09271fbcf3b23131a23d2a099a06464210ca0c92f190c130f94dc9b887c7e418748e';
const decryptedData =
  '{"version":"v1.0.0","mtime":1608048741382,"accounts":{},"addressBook":{"a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe":{"label":"MyCrypto Tip Jar","address":"0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520","notes":"Toss us a coin!","network":"Ethereum","uuid":"a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe"}},"assets":{},"contracts":{},"networks":{},"notifications":{},"settings":{"fiatCurrency":"USD","darkMode":false,"dashboardAccounts":[],"excludedAssets":[],"inactivityTimer":1800000,"rates":{},"language":"en"},"password":"b9c950640e1b3740e98acb93e669c65766f6670dd1609ba91ff41052ba48c6f3","networkNodes":{},"userActions":{}}';

Date.now = jest.fn(() => 1608048741382);

describe('encryptionWorker()', () => {
  it('encrypts existing state and resets app state', () => {
    return expectSaga(encryptionWorker, encrypt(hashedPassword))
      .withState({ legacy: marshallState(JSON.parse(decryptedData)) })
      .call(encryptData, decryptedData, hashedPassword)
      .put(setEncryptedData(encryptedData))
      .silentRun();
  });
});

describe('decryptionWorker()', () => {
  it('decrypts existing state and imports', () => {
    return expectSaga(decryptionWorker, decrypt(hashedPassword))
      .withState({
        legacy: { networks: fNetworks, assets: fAssets, accounts: fAccounts },
        vault: {
          data: encryptedData
        }
      })
      .call(decryptData, encryptedData, hashedPassword)
      .put(clearEncryptedData())
      .put(importState(decryptedData))
      .silentRun();
  });
});
