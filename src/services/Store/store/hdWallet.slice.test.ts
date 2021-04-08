import { expectSaga, mockAppState } from 'test-utils';

import { fAccount, fAssets, fNetwork, fNetworks } from '@fixtures';
import { DWAccountDisplay, ExtendedDPath } from '@services';
import { HardwareWalletResult } from '@services/WalletService';
import { selectWallet } from '@services/WalletService/deterministic';
import { DPath, DPathFormat, TAddress, WalletId } from '@types';
import { bigify as mockBigify, noOp } from '@utils';

import {
  accountsQueueWorker,
  addDPathsWorker,
  addNewDPaths,
  connectToHDWallet,
  getAccounts,
  getAccountsWorker,
  getHDWalletAsset,
  getHDWalletNetwork,
  getHDWalletQueuedAccounts,
  HDWalletErrors,
  initialState,
  processAccountsQueue,
  requestConnectionWorker,
  default as slice,
  updateAnAsset,
  updateAssetWorker
} from './hdWallet.slice';
import { AppState } from './root.reducer';

const reducer = slice.reducer;

const {
  requestConnection,
  onConnectionFailure,
  onConnectionSuccess,
  requestAddresses,
  onRequestAddressesFailure,
  onRequestAddressesSuccess,
  enqueueAccounts,
  updateAccounts,
  updateAsset,
  addCustomDPaths,
  triggerComplete
} = slice.actions;
const addressToTestWith = fAccount.address as TAddress;

const fExtendedDPath: ExtendedDPath = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'",
  offset: 0,
  numOfAddresses: 1
};

const fDWAccountDisplayPreBalance: DWAccountDisplay = {
  address: addressToTestWith,
  pathItem: {
    baseDPath: fExtendedDPath,
    path: "m/44'/60'/0'/0",
    index: 0
  }
};

const fDWAccountDisplay: DWAccountDisplay = {
  ...fDWAccountDisplayPreBalance,
  balance: '0'
};

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

  it('onConnectionFailure(): sets isConnecting to false indicating end of connecting process, and sets an error', () => {
    const actual = reducer(initialState, onConnectionFailure(err));
    const expected = { ...initialState, isConnecting: false, error: err };
    expect(actual).toEqual(expected);
  });

  it('onConnectionSuccess(): updates isConnected to true and sets network and asset params', () => {
    const actual = reducer(
      initialState,
      onConnectionSuccess({ asset: fAssets[0], network: fNetwork })
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

  it('onRequestAddressesSuccess(): correctly sets isGettingAccounts to false to signal end of the process.', () => {
    const actual = reducer(initialState, onRequestAddressesSuccess());
    const expected = { ...initialState, isGettingAccounts: false, error: undefined };
    expect(actual).toEqual(expected);
  });

  it('onRequestAddressesFailure(): handles an error when fetching addresses, sets isComplete to true and isGettingAccounts to false to signal the end of the fetch.', () => {
    const actual = reducer(initialState, onRequestAddressesFailure(err));
    const expected = { ...initialState, isCompleted: true, isGettingAccounts: false, error: err };
    expect(actual).toEqual(expected);
  });

  it('addCustomDPaths(): Adds custom dpaths to state and sets isCompleted to false.', () => {
    const actual = reducer(initialState, addCustomDPaths([fExtendedDPath]));
    const expected = { ...initialState, isCompleted: false, customDPaths: [fExtendedDPath] };
    expect(actual).toEqual(expected);
  });

  it('triggerComplete(): Sets isCompleted to true.', () => {
    const actual = reducer(initialState, triggerComplete());
    const expected = { ...initialState, isCompleted: true };
    expect(actual).toEqual(expected);
  });
});

const ledgerMock = {
  initialize() {
    return Promise.resolve();
  },
  getAddress() {
    return Promise.resolve({} as HardwareWalletResult);
  },
  getMultipleAddresses() {
    return Promise.resolve([fDWAccountDisplayPreBalance]);
  },
  getDPaths() {
    return [] as DPath[];
  }
};

jest.mock('../../WalletService/deterministic/helpers.ts', () => ({
  selectWallet: jest.fn().mockImplementation(() => Promise.resolve(ledgerMock))
}));

describe('requestConnectionWorker()', () => {
  it('attempts to connect to a hierarchical deterministic wallet given walletId', () => {
    const inputPayload = {
      walletId: WalletId.LEDGER_NANO_S_NEW as DPathFormat,
      dpaths: [fExtendedDPath],
      network: fNetwork,
      asset: fAssets[0],
      setSession: noOp
    };
    return expectSaga(requestConnectionWorker, connectToHDWallet(inputPayload))
      .withState(mockAppState({ networks: fNetworks }))
      .call(selectWallet, inputPayload.walletId)
      .call([ledgerMock, 'initialize'], inputPayload.dpaths[0])
      .call(inputPayload.setSession, ledgerMock)
      .put(requestConnection())
      .put(onConnectionSuccess({ asset: inputPayload.asset, network: inputPayload.network }))
      .silentRun();
  });
});

describe('getAccountsWorker()', () => {
  it('attempts to fetch a collection of account addresses given specified dpaths extendedDPaths', () => {
    const inputPayload = {
      session: ledgerMock,
      dpaths: [fExtendedDPath]
    };
    return expectSaga(getAccountsWorker, getAccounts(inputPayload))
      .withState(mockAppState({ networks: fNetworks }))
      .put(requestAddresses())
      .call([ledgerMock, 'getMultipleAddresses'], inputPayload.dpaths)
      .put(enqueueAccounts([fDWAccountDisplayPreBalance]))
      .put(processAccountsQueue())
      .silentRun();
  });
});

jest.mock('../BalanceService.tsx', () => ({
  getBaseAssetBalancesForAddresses: jest.fn().mockImplementation(() => {
    const amt = mockBigify('0');
    return Promise.resolve({ '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': amt });
  })
}));

describe('accountsQueueWorker()', () => {
  it('fetches balances for queuedAccounts in state', () => {
    const beginningState = {
      ...initialState,
      isConnected: true,
      queuedAccounts: [fDWAccountDisplayPreBalance],
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
      .select(getHDWalletNetwork)
      .select(getHDWalletQueuedAccounts)
      .select(getHDWalletAsset)
      .put(updateAccounts({ accounts: [fDWAccountDisplay], asset: beginningState.asset }))
      .silentRun();
  });
});

describe('updateAssetWorker()', () => {
  it('updates the hdWallet asset', () => {
    const beginningState = {
      ...initialState,
      isConnected: true,
      queuedAccounts: [fDWAccountDisplayPreBalance],
      network: fNetwork,
      asset: fAssets[1]
    };
    return expectSaga(updateAssetWorker, updateAnAsset({ asset: fAssets[0] }))
      .withState(({
        networks: fNetworks,
        assets: fAssets,
        hdWallet: beginningState
      } as unknown) as AppState)
      .put(updateAsset(fAssets[0]))
      .silentRun();
  });
});

describe('addDPathsWorker()', () => {
  it('adds the custom derivation path', () => {
    const beginningState = {
      ...initialState,
      isConnected: true,
      queuedAccounts: [fDWAccountDisplayPreBalance],
      network: fNetwork,
      asset: fAssets[1]
    };
    return expectSaga(addDPathsWorker, addNewDPaths({ customDPaths: [fExtendedDPath] }))
      .withState(({
        networks: fNetworks,
        assets: fAssets,
        hdWallet: beginningState
      } as unknown) as AppState)
      .put(addCustomDPaths([fExtendedDPath]))
      .silentRun();
  });
});
