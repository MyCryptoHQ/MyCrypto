import { DeterministicWallet } from '@mycrypto/wallets';
import { expectSaga, mockAppState, mockStore } from 'test-utils';

import {
  fAssets,
  fDWAccountDisplay,
  fDWAccountDisplayPreBalance,
  fExtendedDPath,
  fNetwork,
  fNetworks
} from '@fixtures';
import { getWallet } from '@services/WalletService';
import { AppState } from '@store/root.reducer';
import { DPathFormat, WalletId } from '@types';
import { bigify as mockBigify } from '@utils';

import {
  accountsQueueWorker,
  connectHDWallet,
  getAccounts,
  getAccountsWorker,
  HDWalletErrors,
  initialState,
  processAccountsQueue,
  requestConnectionWorker,
  selectHDWalletAccountQueue,
  selectHDWalletAsset,
  selectHDWalletNetwork,
  setSession,
  default as slice
} from './hdWallet.slice';

const reducer = slice.reducer;

const {
  requestConnection,
  requestConnectionFailure,
  requestConnectionSuccess,
  requestAddresses,
  requestAddressesFailure,
  requestAddressesSuccess,
  enqueueAccounts,
  updateAccounts,
  updateAsset,
  addCustomDPaths,
  triggerComplete
} = slice.actions;

describe('HD Wallet Slice', () => {
  const err = {
    code: HDWalletErrors.SESSION_CONNECTION_FAILED,
    message: 'Failed to connect. Device not found.'
  };
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('requestConnection(): sets isConnecting to true', () => {
    const actual = reducer(initialState, requestConnection());
    const expected = { ...initialState, isConnecting: true };
    expect(actual).toEqual(expected);
  });

  it('requestConnectionFailure(): sets isConnecting to false indicating end of connecting process, and sets an error', () => {
    const actual = reducer(initialState, requestConnectionFailure(err));
    const expected = { ...initialState, isConnecting: false, error: err };
    expect(actual).toEqual(expected);
  });

  it('requestConnectionSuccess(): updates isConnected to true and sets network and asset params', () => {
    const actual = reducer(
      initialState,
      requestConnectionSuccess({ asset: fAssets[0], network: fNetwork })
    );
    const expected = {
      ...initialState,
      isConnecting: false,
      isConnected: true,
      network: fNetwork,
      asset: fAssets[0]
    };
    expect(actual).toEqual(expected);
  });

  it('requestAddresses(): sets isGettingAccounts to true to signal beginning of the requestAddresses process', () => {
    const actual = reducer(initialState, requestAddresses());
    const expected = { ...initialState, isGettingAccounts: true, isCompleted: false };
    expect(actual).toEqual(expected);
  });

  it('requestAddressesSuccess(): correctly sets isGettingAccounts to false to signal end of the process.', () => {
    const actual = reducer(initialState, requestAddressesSuccess());
    const expected = { ...initialState, isGettingAccounts: false, error: undefined };
    expect(actual).toEqual(expected);
  });

  it('requestAddressesFailure(): handles an error when fetching addresses, sets isComplete to true and isGettingAccounts to false to signal the end of the fetch.', () => {
    const actual = reducer(initialState, requestAddressesFailure(err));
    const expected = { ...initialState, isCompleted: true, isGettingAccounts: false, error: err };
    expect(actual).toEqual(expected);
  });

  it('addCustomDPaths(): Adds custom dpaths to state and sets isCompleted to false.', () => {
    const actual = reducer(initialState, addCustomDPaths([fExtendedDPath]));
    const expected = { ...initialState, isCompleted: false, customDPaths: [fExtendedDPath] };
    expect(actual).toEqual(expected);
  });

  it('updateAsset(): Adds custom dpaths to state and sets isCompleted to false.', () => {
    const actual = reducer(initialState, updateAsset(fAssets[0]));
    const expected = { ...initialState, isCompleted: false, asset: fAssets[0] };
    expect(actual).toEqual(expected);
  });

  it('triggerComplete(): Sets isCompleted to true.', () => {
    const actual = reducer(initialState, triggerComplete());
    const expected = { ...initialState, isCompleted: true };
    expect(actual).toEqual(expected);
  });
});

const ledgerMock = {
  getAddress() {
    return Promise.resolve();
  },
  getAddressesWithMultipleDPaths() {
    return Promise.resolve([
      {
        ...fDWAccountDisplayPreBalance,
        dPath: fDWAccountDisplayPreBalance.pathItem.path,
        index: fDWAccountDisplayPreBalance.pathItem.index,
        dPathInfo: fExtendedDPath
      }
    ]);
  }
};

jest.mock('@services/WalletService/walletService', () => ({
  ...jest.requireActual('@services/WalletService/walletService'),
  getWallet: jest.fn().mockImplementation(() => Promise.resolve(ledgerMock))
}));

describe('requestConnectionWorker()', () => {
  it('attempts to connect to a hierarchical deterministic wallet given walletId', () => {
    const inputPayload = {
      walletId: WalletId.LEDGER_NANO_S_NEW as DPathFormat,
      dpaths: [fExtendedDPath],
      network: fNetwork,
      asset: fAssets[0]
    };
    return expectSaga(requestConnectionWorker, connectHDWallet(inputPayload))
      .withState(mockAppState({ networks: fNetworks, connections: { wallets: {} } }))
      .call(getWallet, inputPayload.walletId, undefined)
      .put(requestConnection())
      .put(setSession((ledgerMock as unknown) as DeterministicWallet))
      .call([ledgerMock, 'getAddress'], inputPayload.dpaths[0], 0)
      .put(requestConnectionSuccess({ asset: inputPayload.asset, network: inputPayload.network }))
      .silentRun();
  });
});

describe('getAccountsWorker()', () => {
  it('attempts to fetch a collection of account addresses given specified dpaths extendedDPaths', () => {
    const inputPayload = {
      dpaths: [fExtendedDPath]
    };
    return expectSaga(getAccountsWorker, getAccounts(inputPayload))
      .withState(
        mockStore({
          dataStoreState: { networks: fNetworks },
          storeSlice: { hdWallet: { session: (ledgerMock as unknown) as DeterministicWallet } }
        })
      )
      .put(requestAddresses())
      .call(
        [ledgerMock, 'getAddressesWithMultipleDPaths'],
        inputPayload.dpaths.map((path) => ({
          limit: path.numOfAddresses,
          offset: path.offset,
          path
        }))
      )
      .put(enqueueAccounts([fDWAccountDisplayPreBalance]))
      .put(processAccountsQueue())
      .silentRun();
  });
});

jest.mock('@services/Store/BalanceService.tsx', () => ({
  getAssetBalance: jest.fn().mockImplementation(() => {
    const amt = mockBigify('0');
    return Promise.resolve({ '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': amt });
  })
}));

describe('accountsQueueWorker()', () => {
  it('fetches balances for accountQueue in state', () => {
    const beginningState = {
      ...initialState,
      isConnected: true,
      accountQueue: [fDWAccountDisplayPreBalance],
      network: fNetwork,
      asset: fAssets[1]
    };
    //@ts-expect-error wrong typing for sagas
    return expectSaga(accountsQueueWorker, processAccountsQueue())
      .withState(({
        networks: fNetworks,
        assets: fAssets,
        hdWallet: beginningState
      } as unknown) as AppState)
      .select(selectHDWalletNetwork)
      .select(selectHDWalletAccountQueue)
      .select(selectHDWalletAsset)
      .put(updateAccounts({ accounts: [fDWAccountDisplay], asset: beginningState.asset }))
      .silentRun();
  });
});
