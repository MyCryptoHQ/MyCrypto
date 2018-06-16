import { SagaIterator, delay, Task } from 'redux-saga';
import { apply, call, fork, put, select, takeEvery, take, cancel } from 'redux-saga/effects';

import translate from 'translations';
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
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import * as configMetaTypes from 'features/config/meta/types';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as configSelectors from 'features/config/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as customTokensTypes from 'features/customTokens/types';
import * as customTokensSelectors from 'features/customTokens/selectors';
import * as walletTypes from './types';
import * as walletActions from './actions';
import * as walletSelectors from './selectors';

export function* getTokenBalancesSaga(wallet: IWallet, tokens: Token[]) {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const address: string = yield apply(wallet, wallet.getAddressString);
  const tokenBalances: walletTypes.TokenBalance[] = yield apply(node, node.getTokenBalances, [
    address,
    tokens
  ]);
  return tokens.reduce<{ [TokenSymbol: string]: walletTypes.TokenBalance }>((acc, t, i) => {
    acc[t.symbol] = tokenBalances[i];
    return acc;
  }, {});
}

// Return an array of the tokens that meet any of the following conditions:
//  1. Non-zero balance
//  2. It was in the previous wallet's config
//  3. It's a custom token that the user added
export function* filterScannedTokenBalances(
  wallet: IWallet,
  balances: walletTypes.TokenBalanceLookup
) {
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

    yield put(walletActions.setBalancePending());
    const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(configNodesSelectors.getNodeLib);
    const address: string = yield apply(wallet, wallet.getAddressString);
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(walletActions.setBalanceFullfilled(balance));
  } catch (error) {
    yield put(walletActions.setBalanceRejected());
  }
}

export function* retryTokenBalances(): SagaIterator {
  const tokens: walletTypes.MergedToken[] = yield select(selectors.getWalletConfigTokens);
  if (tokens && tokens.length) {
    yield call(updateTokenBalances);
  } else {
    const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
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

    const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
    const tokens: walletTypes.MergedToken[] = yield select(selectors.getWalletConfigTokens);
    if (!wallet || !tokens.length) {
      return;
    }
    yield put(walletActions.setTokenBalancesPending());
    const tokenBalances: walletTypes.TokenBalanceLookup = yield call(
      getTokenBalancesSaga,
      wallet,
      tokens
    );
    yield put(walletActions.setTokenBalancesFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balances', error);
    yield put(walletActions.setTokenBalancesRejected());
  }
}

export function* updateTokenBalance(
  action: walletTypes.SetTokenBalancePendingAction
): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
    const { tokenSymbol } = action.payload;
    const allTokens: Token[] = yield select(configSelectors.getAllTokens);
    const token = allTokens.find(t => t.symbol === tokenSymbol);

    if (!wallet) {
      return;
    }

    if (!token) {
      throw Error('Token not found');
    }

    const tokenBalances: walletTypes.TokenBalanceLookup = yield call(getTokenBalancesSaga, wallet, [
      token
    ]);

    yield put(walletActions.setTokenBalanceFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balance', error);
    yield put(walletActions.setTokenBalanceRejected());
  }
}

export function* handleScanWalletAction(
  action: walletTypes.ScanWalletForTokensAction
): SagaIterator {
  yield call(scanWalletForTokensSaga, action.payload);
}

export function* scanWalletForTokensSaga(wallet: IWallet): SagaIterator {
  try {
    const isOffline = yield select(configMetaSelectors.getOffline);
    if (isOffline) {
      return;
    }

    const tokens: walletTypes.MergedToken[] = yield select(selectors.getTokens);
    yield put(walletActions.setTokenBalancesPending());

    // Fetch all token balances, save ones we want to the config
    const balances: walletTypes.TokenBalanceLookup = yield call(
      getTokenBalancesSaga,
      wallet,
      tokens
    );
    const tokensToSave: string[] = yield call(filterScannedTokenBalances, wallet, balances);
    const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: tokensToSave });
    yield put(walletActions.setWalletConfig(config));

    yield put(walletActions.setTokenBalancesFulfilled(balances));
  } catch (err) {
    console.error('Failed to scan for tokens', err);
    yield put(walletActions.setTokenBalancesRejected());
  }
}

export function* handleSetWalletTokens(action: walletTypes.SetWalletTokensAction): SagaIterator {
  const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
  if (!wallet) {
    return;
  }

  const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: action.payload });
  yield put(walletActions.setWalletConfig(config));
}

export function* updateBalances(): SagaIterator {
  const updateAccount = yield fork(updateAccountBalance);
  const updateToken = yield fork(updateTokenBalances);

  yield take(walletTypes.WalletActions.SET);
  yield cancel(updateAccount);
  yield cancel(updateToken);
}

export function* handleNewWallet(): SagaIterator {
  yield call(updateWalletConfig);
  yield fork(updateBalances);
}

export function* updateWalletConfig(): SagaIterator {
  const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
  if (!wallet) {
    return;
  }
  const config: WalletConfig = yield call(loadWalletConfig, wallet);
  yield put(walletActions.setWalletConfig(config));
}

export function* unlockPrivateKeySaga(action: walletTypes.UnlockPrivateKeyAction): SagaIterator {
  let wallet: IWallet | null = null;
  const { key, password } = action.payload;

  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    yield put(notificationsActions.showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(walletActions.setWallet(wallet));
}

export function* startLoadingSpinner(): SagaIterator {
  yield call(delay, 400);
  yield put(walletActions.setWalletPending(true));
}

export function* stopLoadingSpinner(loadingFork: Task | null): SagaIterator {
  if (loadingFork !== null && loadingFork !== undefined) {
    yield cancel(loadingFork);
  }
  yield put(walletActions.setWalletPending(false));
}

export function* unlockKeystoreSaga(action: walletTypes.UnlockKeystoreAction): SagaIterator {
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
      yield put(walletActions.setPasswordPrompt());
    } else {
      yield put(notificationsActions.showNotification('danger', translate('ERROR_6')));
    }
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  yield call(stopLoadingSpinner, spinnerTask);
  yield put(walletActions.setWallet(wallet));
}

export function* unlockMnemonicSaga(action: walletTypes.UnlockMnemonicAction): SagaIterator {
  let wallet;
  const { phrase, pass, path, address } = action.payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    yield put(notificationsActions.showNotification('danger', translate('ERROR_14')));
    return;
  }

  yield put(walletActions.setWallet(wallet));
}

export function* handleCustomTokenAdd(
  action: customTokensTypes.AddCustomTokenAction
): SagaIterator {
  // Add the custom token to our current wallet's config
  const wallet: null | IWallet = yield select(walletSelectors.getWalletInst);
  if (!wallet) {
    return;
  }
  const oldConfig: WalletConfig = yield call(loadWalletConfig, wallet);
  const config: WalletConfig = yield call(saveWalletConfig, wallet, {
    tokens: [...(oldConfig.tokens || []), action.payload.symbol]
  });
  yield put(walletActions.setWalletConfig(config));

  // Update token balances
  yield fork(updateTokenBalances);
}

export function* walletSaga(): SagaIterator {
  yield [
    takeEvery(walletTypes.WalletActions.UNLOCK_PRIVATE_KEY, unlockPrivateKeySaga),
    takeEvery(walletTypes.WalletActions.UNLOCK_KEYSTORE, unlockKeystoreSaga),
    takeEvery(walletTypes.WalletActions.UNLOCK_MNEMONIC, unlockMnemonicSaga),
    takeEvery(walletTypes.WalletActions.SET, handleNewWallet),
    takeEvery(walletTypes.WalletActions.SCAN_WALLET_FOR_TOKENS, handleScanWalletAction),
    takeEvery(walletTypes.WalletActions.SET_WALLET_TOKENS, handleSetWalletTokens),
    takeEvery(walletTypes.WalletActions.SET_TOKEN_BALANCE_PENDING, updateTokenBalance),
    takeEvery(walletTypes.WalletActions.REFRESH_ACCOUNT_BALANCE, updateAccountBalance),
    takeEvery(walletTypes.WalletActions.REFRESH_TOKEN_BALANCES, retryTokenBalances),
    // Foreign actions
    takeEvery(configMetaTypes.CONFIG_META.TOGGLE_OFFLINE, updateBalances),
    takeEvery(customTokensTypes.CustomTokensActions.ADD, handleCustomTokenAdd)
  ];
}
