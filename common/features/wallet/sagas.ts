import { SagaIterator, delay, Task } from 'redux-saga';
import { apply, call, fork, put, select, takeEvery, take, cancel } from 'redux-saga/effects';

import configTokens from 'config/tokens';
import { translateRaw } from 'translations';
import { INode } from 'libs/nodes/INode';
import { Wei } from 'libs/units';
import { Token } from 'types/network';
import {
  IWallet,
  MnemonicWallet,
  getPrivKeyWallet,
  getKeystoreWallet,
  determineKeystoreType,
  KeystoreTypes,
  getUtcWallet,
  signWrapper,
  WalletConfig
} from 'libs/wallet';
import { loadWalletConfig, saveWalletConfig } from 'utils/localStorage';
import { getAddressesAndSymbols } from 'utils/tokens';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import {
  configMetaTypes,
  configMetaSelectors,
  configNodesSelectors,
  configSelectors
} from 'features/config';
import { notificationsActions } from 'features/notifications';
import {
  customTokensTypes,
  customTokensActions,
  customTokensSelectors
} from 'features/customTokens';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export function* getTokenBalancesSaga(wallet: IWallet, tokens: Token[]) {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const address: string = yield apply(wallet, wallet.getAddressString);
  const tokenBalances: types.TokenBalance[] = yield apply(node, node.getTokenBalances, [
    address,
    tokens
  ]);
  return tokens.reduce<{ [TokenSymbol: string]: types.TokenBalance }>((acc, t, i) => {
    acc[t.symbol] = tokenBalances[i];
    return acc;
  }, {});
}

// Return an array of the tokens that meet any of the following conditions:
//  1. Non-zero balance
//  2. It was in the previous wallet's config
//  3. It's a custom token that the user added
export function* filterScannedTokenBalances(wallet: IWallet, balances: types.TokenBalanceLookup) {
  const customTokens: AppState['customTokens'] = yield select(
    customTokensSelectors.getCustomTokens
  );
  const oldConfig: WalletConfig = yield call(loadWalletConfig, wallet);
  return Object.keys(balances).filter(symbol => {
    if (balances[symbol] && !balances[symbol].balance.isZero()) {
      return true;
    }
    if (oldConfig.tokens && oldConfig.tokens.includes(symbol)) {
      return true;
    }
    if (customTokens.find(token => token.symbol === symbol)) {
      return true;
    }
  });
}

export function* updateAccountBalance(): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    yield put(actions.setBalancePending());
    const wallet: null | IWallet = yield select(selectors.getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(configNodesSelectors.getNodeLib);
    const address: string = yield apply(wallet, wallet.getAddressString);
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(actions.setBalanceFullfilled(balance));
  } catch (error) {
    yield put(actions.setBalanceRejected());
  }
}

export function* retryTokenBalances(): SagaIterator {
  const tokens: types.MergedToken[] = yield select(derivedSelectors.getWalletConfigTokens);
  if (tokens && tokens.length) {
    yield call(updateTokenBalances);
  } else {
    const wallet: null | IWallet = yield select(selectors.getWalletInst);
    if (wallet) {
      yield call(scanWalletForTokensSaga, wallet);
    }
  }
}

export function* updateTokenBalances(): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    const wallet: null | IWallet = yield select(selectors.getWalletInst);
    const tokens: types.MergedToken[] = yield select(derivedSelectors.getWalletConfigTokens);
    if (!wallet || !tokens.length) {
      return;
    }
    yield put(actions.setTokenBalancesPending());
    const tokenBalances: types.TokenBalanceLookup = yield call(
      getTokenBalancesSaga,
      wallet,
      tokens
    );
    yield put(actions.setTokenBalancesFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balances', error);
    yield put(actions.setTokenBalancesRejected());
  }
}

export function* updateTokenBalance(action: types.SetTokenBalancePendingAction): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    const wallet: null | IWallet = yield select(selectors.getWalletInst);
    const { tokenSymbol } = action.payload;
    const allTokens: Token[] = yield select(configSelectors.getAllTokens);
    const token = allTokens.find(t => t.symbol === tokenSymbol);

    if (!wallet) {
      return;
    }

    if (!token) {
      throw Error('Token not found');
    }

    const tokenBalances: types.TokenBalanceLookup = yield call(getTokenBalancesSaga, wallet, [
      token
    ]);

    yield put(actions.setTokenBalanceFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balance', error);
    yield put(actions.setTokenBalanceRejected());
  }
}

export function* handleScanWalletAction(action: types.ScanWalletForTokensAction): SagaIterator {
  yield call(scanWalletForTokensSaga, action.payload);
}

export function* scanWalletForTokensSaga(wallet: IWallet): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    const tokens: types.MergedToken[] = yield select(derivedSelectors.getTokens);
    yield put(actions.setTokenBalancesPending());

    // Fetch all token balances, save ones we want to the config
    const balances: types.TokenBalanceLookup = yield call(getTokenBalancesSaga, wallet, tokens);
    const tokensToSave: string[] = yield call(filterScannedTokenBalances, wallet, balances);
    const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: tokensToSave });
    yield put(actions.setWalletConfig(config));

    yield put(actions.setTokenBalancesFulfilled(balances));
  } catch (err) {
    console.error('Failed to scan for tokens', err);
    yield put(actions.setTokenBalancesRejected());
  }
}

export function* handleSetWalletTokens(action: types.SetWalletTokensAction): SagaIterator {
  const wallet: null | IWallet = yield select(selectors.getWalletInst);
  if (!wallet) {
    return;
  }

  const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: action.payload });
  yield put(actions.setWalletConfig(config));
}

export function* updateBalances(): SagaIterator {
  const updateAccount = yield fork(updateAccountBalance);
  const updateToken = yield fork(updateTokenBalances);

  yield take(types.WalletActions.SET);
  yield cancel(updateAccount);
  yield cancel(updateToken);
}

export function* handleNewWallet(): SagaIterator {
  yield call(updateWalletConfig);
  yield fork(updateBalances);
}

export function* updateWalletConfig(): SagaIterator {
  const wallet: null | IWallet = yield select(selectors.getWalletInst);
  if (!wallet) {
    return;
  }
  const config: WalletConfig = yield call(loadWalletConfig, wallet);
  yield put(actions.setWalletConfig(config));
}

export function* unlockPrivateKeySaga(action: types.UnlockPrivateKeyAction): SagaIterator {
  let wallet: IWallet | null = null;
  const { key, password } = action.payload;

  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    yield put(notificationsActions.showNotification('danger', translateRaw('INVALID_PKEY')));
    return;
  }
  yield put(actions.setWallet(wallet));
}

export function* startLoadingSpinner(): SagaIterator {
  yield call(delay, 400);
  yield put(actions.setWalletPending(true));
}

export function* stopLoadingSpinner(loadingFork: Task | null): SagaIterator {
  if (loadingFork !== null && loadingFork !== undefined) {
    yield cancel(loadingFork);
  }
  yield put(actions.setWalletPending(false));
}

export function* unlockKeystoreSaga(action: types.UnlockKeystoreAction): SagaIterator {
  const { file, password } = action.payload;
  let wallet: null | IWallet = null;
  let spinnerTask: null | Task = null;
  try {
    if (determineKeystoreType(file) === KeystoreTypes.utc) {
      spinnerTask = yield fork(startLoadingSpinner);
      wallet = signWrapper(yield call(getUtcWallet, file, password));
    } else {
      wallet = getKeystoreWallet(file, password);
    }
  } catch (e) {
    yield call(stopLoadingSpinner, spinnerTask);
    if (
      password === '' &&
      e.message === 'Private key does not satisfy the curve requirements (ie. it is invalid)'
    ) {
      yield put(actions.setPasswordPrompt());
    } else {
      yield put(notificationsActions.showNotification('danger', translateRaw('ERROR_6')));
    }
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  yield call(stopLoadingSpinner, spinnerTask);
  yield put(actions.setWallet(wallet));
}

export function* unlockMnemonicSaga(action: types.UnlockMnemonicAction): SagaIterator {
  let wallet;
  const { phrase, pass, path, address } = action.payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    yield put(notificationsActions.showNotification('danger', translateRaw('ERROR_14')));
    return;
  }

  yield put(actions.setWallet(wallet));
}

export function* handleCustomTokenAdd(
  action: customTokensTypes.AddCustomTokenAction
): SagaIterator {
  // Ensure the added token address and symbol doesn't exist in the static tokens.
  const { id } = yield select(configSelectors.getNetworkConfig);
  const { address, symbol } = action.payload;
  const tokenList = (configTokens as any)[id];
  const usedAddressesAndSymbols = getAddressesAndSymbols(tokenList);
  if (usedAddressesAndSymbols.addresses[address]) {
    yield put(notificationsActions.showNotification('danger', translateRaw('CUSTOM_TOKEN_1')));
    return;
  }
  if (usedAddressesAndSymbols.symbols[symbol]) {
    yield put(notificationsActions.showNotification('danger', translateRaw('CUSTOM_TOKEN_2')));
    return;
  }
  // Add the custom token.
  yield put(customTokensActions.addCustomToken(action.payload));

  // Add the custom token to our current wallet's config
  const wallet: null | IWallet = yield select(selectors.getWalletInst);
  if (!wallet) {
    return;
  }
  const oldConfig: WalletConfig = yield call(loadWalletConfig, wallet);
  const config: WalletConfig = yield call(saveWalletConfig, wallet, {
    tokens: [...(oldConfig.tokens || []), action.payload.symbol]
  });
  yield put(actions.setWalletConfig(config));

  // Update token balances
  yield fork(updateTokenBalances);
}

export function* walletSaga(): SagaIterator {
  yield [
    takeEvery(types.WalletActions.UNLOCK_PRIVATE_KEY, unlockPrivateKeySaga),
    takeEvery(types.WalletActions.UNLOCK_KEYSTORE, unlockKeystoreSaga),
    takeEvery(types.WalletActions.UNLOCK_MNEMONIC, unlockMnemonicSaga),
    takeEvery(types.WalletActions.SET, handleNewWallet),
    takeEvery(types.WalletActions.SCAN_WALLET_FOR_TOKENS, handleScanWalletAction),
    takeEvery(types.WalletActions.SET_WALLET_TOKENS, handleSetWalletTokens),
    takeEvery(types.WalletActions.SET_TOKEN_BALANCE_PENDING, updateTokenBalance),
    takeEvery(types.WalletActions.REFRESH_ACCOUNT_BALANCE, updateAccountBalance),
    takeEvery(types.WalletActions.REFRESH_TOKEN_BALANCES, retryTokenBalances),
    // Foreign actions
    takeEvery(configMetaTypes.ConfigMetaActions.TOGGLE_OFFLINE, updateBalances),
    takeEvery(customTokensTypes.CustomTokensActions.ATTEMPT_ADD, handleCustomTokenAdd)
  ];
}
