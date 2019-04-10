import { apply, call, fork, put, select, take, cancel } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { IFullWallet, IV3Wallet, fromV3 } from 'ethereumjs-wallet';

import { translateRaw } from 'translations';
import configuredStore from 'features/store';
import { getUtcWallet, PrivKeyWallet } from 'libs/wallet';
import { Wei } from 'libs/units';
import RpcNode from 'libs/nodes/rpc';
import Web3Node from 'libs/nodes/web3';
import { INode } from 'libs/nodes/INode';
import { Token } from 'types/network';
import * as derivedSelectors from 'features/selectors';
import {
  configMetaSelectors,
  configNodesSelectors,
  configNodesStaticActions,
  configNodesSelectedTypes,
  configNodesSelectedActions,
  configSagas
} from 'features/config';
import { notificationsActions } from 'features/notifications';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import * as sagas from './sagas';

configuredStore.getState();

const offline = false;
const pkey = '31e97f395cabc6faa37d8a9d6bb185187c35704e7b976c7a110e2f0eab37c344';
const wallet = PrivKeyWallet(Buffer.from(pkey, 'hex'));
const address = '0xe2EdC95134bbD88443bc6D55b809F7d0C2f0C854';
const balance = Wei('100');
const node: INode = new RpcNode('');

const token1: Token = {
  address: '0x2',
  symbol: 'OMG',
  decimal: 16
};
const token2: Token = {
  address: '0x3',
  symbol: 'BAT',
  decimal: 16
};
const tokens = [token1, token2];

const utcKeystore: IV3Wallet = {
  version: 3,
  id: 'cb788af4-993d-43ad-851b-0d2031e52c61',
  address: '25a24679f35e447f778cf54a3823facf39904a63',
  crypto: {
    ciphertext: '4193915c560835d00b2b9ff5dd20f3e13793b2a3ca8a97df649286063f27f707',
    cipherparams: {
      iv: 'dccb8c009b11d1c6226ba19b557dce4c'
    },
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: '037a53e520f2d00fb70f02f39b31b77374de9e0e1d35fd7cbe9c8a8b21d6b0ab',
      n: 1024,
      r: 8,
      p: 1
    },
    mac: '774fbe4bf35e7e28df15cd6c3546e74ce6608e9ab68a88d50227858a3b05769a'
  }
};

// necessary so we can later inject a mocked web3 to the window

describe('sagas.updateAccountBalance*', () => {
  const gen = sagas.updateAccountBalance();

  it('should select offline', () => {
    expect(gen.next().value).toEqual(select(configMetaSelectors.getOffline));
  });

  it('should put setBalancePending', () => {
    expect(gen.next(false).value).toEqual(put(actions.setBalancePending()));
  });

  it('should select getWalletInst', () => {
    expect(gen.next(false).value).toEqual(select(selectors.getWalletInst));
  });

  it('should select getNodeLib', () => {
    expect(gen.next(wallet).value).toEqual(select(configNodesSelectors.getNodeLib));
  });

  it('should apply wallet.getAddressString', () => {
    expect(gen.next(node).value).toEqual(apply(wallet, wallet.getAddressString));
  });

  it('should apply node.getBalance', () => {
    expect(gen.next(address).value).toEqual(apply(node, node.getBalance, [address]));
  });

  it('should put setBalanceFulfilled', () => {
    expect(gen.next(balance).value).toEqual(put(actions.setBalanceFullfilled(balance)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should bail out if offline', () => {
    const offlineGen = sagas.updateAccountBalance();
    offlineGen.next();
    expect(offlineGen.next(true).done).toBe(true);
  });

  it('should bail out if wallet inst is missing', () => {
    const noWalletGen = sagas.updateAccountBalance();
    noWalletGen.next();
    noWalletGen.next(false);
    noWalletGen.next(false);
    expect(noWalletGen.next(null).done).toBe(true);
  });
});

describe('updateTokenBalances*', () => {
  const gen = cloneableGenerator(sagas.updateTokenBalances)();

  it('should bail out if offline', () => {
    const offlineGen = gen.clone();
    expect(offlineGen.next());
    expect(offlineGen.next(true).done).toBe(true);
  });

  it('should select getOffline', () => {
    expect(gen.next().value).toEqual(select(configMetaSelectors.getOffline));
  });

  it('should select getWalletInst', () => {
    expect(gen.next(offline).value).toEqual(select(selectors.getWalletInst));
  });

  it('should return if wallet is falsey', () => {
    const noWalletGen = gen.clone();
    noWalletGen.next(null);
    expect(noWalletGen.next().done).toEqual(true);
  });

  it('should select getWalletConfigTokens', () => {
    expect(gen.next(wallet).value).toEqual(select(derivedSelectors.getWalletConfigTokens));
  });

  it('should return if no tokens are requested', () => {
    const noTokensGen = gen.clone();
    noTokensGen.next({});
    expect(noTokensGen.next().done).toEqual(true);
  });

  it('should put setTokenBalancesPending', () => {
    expect(gen.next(tokens).value).toEqual(put(actions.setTokenBalancesPending()));
  });

  it('should put setTokenBalancesRejected on throw', () => {
    const throwGen = gen.clone();
    if (throwGen.throw) {
      expect(throwGen.throw().value).toEqual(put(actions.setTokenBalancesRejected()));
    }
  });

  it('should call getTokenBalances', () => {
    expect(gen.next().value).toEqual(call(sagas.getTokenBalancesSaga, wallet, tokens));
  });

  it('should put setTokenBalancesFufilled', () => {
    expect(gen.next({}).value).toEqual(put(actions.setTokenBalancesFulfilled({})));
  });
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('updateBalances*', () => {
  const gen = sagas.updateBalances();
  const updateAccount = createMockTask();
  const updateToken = createMockTask();

  it('should fork sagas.updateAccountBalance', () => {
    expect(gen.next().value).toEqual(fork(sagas.updateAccountBalance));
  });

  it('should fork updateTokenBalances', () => {
    expect(gen.next(updateAccount).value).toEqual(fork(sagas.updateTokenBalances));
  });

  it('should take on WALLET_SET', () => {
    expect(gen.next(updateToken).value).toEqual(take(types.WalletActions.SET));
  });

  it('should cancel updates', () => {
    expect(gen.next().value).toEqual(cancel(updateAccount));
    expect(gen.next().value).toEqual(cancel(updateToken));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('unlockPrivateKey', () => {
  const value = {
    key: pkey,
    password: ''
  };
  const action = actions.unlockPrivateKey(value);
  const gen = sagas.unlockPrivateKeySaga(action);

  it('should match put setWallet snapshot', () => {
    expect(gen.next().value).toMatchSnapshot();
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('unlockKeystore*', () => {
  const action = actions.unlockKeystore({
    file: JSON.stringify(utcKeystore),
    password: 'testtesttest'
  });
  const gen = sagas.unlockKeystoreSaga(action);
  const mockTask = createMockTask();
  const spinnerFork = fork(sagas.startLoadingSpinner);

  it('should fork startLoadingSpinner', () => {
    expect(gen.next().value).toEqual(spinnerFork);
  });

  it('should call getUtcWallet', () => {
    expect(gen.next(mockTask).value).toEqual(
      call(getUtcWallet, action.payload.file, action.payload.password)
    );
  });

  //keystore in this case decrypts quickly, so use fromV3 in ethjs-wallet to avoid testing with promises
  it('should call stopLoadingSpinner', () => {
    const mockWallet: IFullWallet = fromV3(action.payload.file, action.payload.password, true);
    expect(gen.next(mockWallet).value).toEqual(call(sagas.stopLoadingSpinner, mockTask));
  });

  it('should match put setWallet snapshot', () => {
    expect(gen.next().value).toMatchSnapshot();
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('unlockMnemonic*', () => {
  const action = actions.unlockMnemonic({
    phrase: 'first catalog away faculty jelly now life kingdom pigeon raise gain accident',
    pass: '',
    path: "m/44'/60'/0'/0/8",
    address: '0xe2EdC95134bbD88443bc6D55b809F7d0C2f0C854'
  });
  const gen = sagas.unlockMnemonicSaga(action);

  it('should match put setWallet snapshot', () => {
    expect(gen.next().value).toMatchSnapshot();
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('unlockWeb3*', () => {
  const G = global as any;
  const data = {} as any;
  data.gen = cloneableGenerator(configSagas.unlockWeb3)();
  const accounts = [address];
  const { random } = Math;
  let nodeLib: Web3Node;

  function sendAsync(options: any, cb: any) {
    const resp = {
      id: 'id'
    };
    switch (options.method) {
      case 'net_version':
        return cb(null, { ...resp, result: '1' });
      case 'eth_accounts':
        return cb(null, { ...resp, result: JSON.stringify(accounts) });
    }
  }

  beforeAll(async done => {
    G.web3 = {
      currentProvider: {
        sendAsync
      }
    };
    nodeLib = new Web3Node();
    Math.random = () => 0.001;
    await configSagas.initWeb3Node();
    done();
  });

  afterAll(() => {
    Math.random = random;
    delete G.web3;
  });

  it('should call initWeb3Node', () => {
    expect(data.gen.next().value).toEqual(call(configSagas.initWeb3Node));
  });

  it('should put changeNodeRequested', () => {
    expect(data.gen.next(nodeLib).value).toEqual(
      put(configNodesSelectedActions.changeNodeRequested('web3'))
    );
  });

  it('should yield take on node change', () => {
    const expected = take(
      (action: any) =>
        action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeSelection === 'web3'
    );
    const result = data.gen.next().value;
    expect(JSON.stringify(expected)).toEqual(JSON.stringify(result));
  });

  it('should select getWeb3Node', () => {
    expect(data.gen.next().value).toEqual(select(configNodesSelectors.getWeb3Node));
  });

  it('should throw & catch if node is not web3 node', () => {
    data.clone = data.gen.clone();

    expect(data.clone.throw(Error('Cannot use Web3 wallet without a Web3 node.')).value).toEqual(
      put(configNodesStaticActions.web3UnsetNode())
    );
    expect(data.clone.next().value).toEqual(
      put(
        notificationsActions.showNotification(
          'danger',
          translateRaw('Cannot use Web3 wallet without a Web3 node.')
        )
      )
    );
    expect(data.clone.next().done).toEqual(true);
  });

  it('should apply nodeLib.getAccounts', () => {
    expect(data.gen.next({ lib: nodeLib }).value).toEqual(apply(nodeLib, nodeLib.getAccounts));
  });

  it('should throw & catch if no accounts found', () => {
    data.clone1 = data.gen.clone();
    expect(data.clone1.next([]).value).toEqual(put(configNodesStaticActions.web3UnsetNode()));
    expect(data.clone1.next().value).toEqual(
      put(
        notificationsActions.showNotification(
          'danger',
          translateRaw('No accounts found in MetaMask / Web3.')
        )
      )
    );
    expect(data.clone1.next().done).toEqual(true);
  });

  it('should match setWallet snapshot', () => {
    expect(data.gen.next(accounts).value).toMatchSnapshot();
  });
});
