import { showNotification } from 'actions/notifications';
import {
  setBalanceFullfilled,
  setBalancePending,
  setBalanceRejected,
  setTokenBalancesPending,
  setTokenBalancesFulfilled,
  setTokenBalancesRejected,
  setWallet,
  setWalletPending,
  setWalletConfig,
  UnlockKeystoreAction,
  UnlockMnemonicAction,
  UnlockPrivateKeyAction,
  ScanWalletForTokensAction,
  SetWalletTokensAction,
  TypeKeys,
  SetTokenBalancePendingAction,
  setTokenBalanceFulfilled,
  setTokenBalanceRejected,
  setPasswordPrompt
} from 'actions/wallet';
import { Wei } from 'libs/units';
import { TypeKeys as ConfigTypeKeys } from 'actions/config';
import { AddCustomTokenAction, TypeKeys as CustomTokenTypeKeys } from 'actions/customTokens';
import { INode } from 'libs/nodes/INode';
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
import { SagaIterator, delay, Task } from 'redux-saga';
import { apply, call, fork, put, select, takeEvery, take, cancel } from 'redux-saga/effects';
import { getNodeLib, getAllTokens, getOffline } from 'selectors/config';
import {
  getTokens,
  getWalletInst,
  getWalletConfigTokens,
  MergedToken,
  TokenBalance
} from 'selectors/wallet';
import translate from 'translations';
import { loadWalletConfig, saveWalletConfig } from 'utils/localStorage';
import { getTokenBalances, filterScannedTokenBalances } from './helpers';
import { Token } from 'types/network';

export interface TokenBalanceLookup {
  [symbol: string]: TokenBalance;
}

export function* updateAccountBalance(): SagaIterator {
  try {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      return;
    }

    yield put(setBalancePending());
    const wallet: null | IWallet = yield select(getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(getNodeLib);
    const address: string = yield apply(wallet, wallet.getAddressString);
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(setBalanceFullfilled(balance));
  } catch (error) {
    yield put(setBalanceRejected());
  }
}

export function* retryTokenBalances(): SagaIterator {
  const tokens: MergedToken[] = yield select(getWalletConfigTokens);
  if (tokens && tokens.length) {
    yield call(updateTokenBalances);
  } else {
    const wallet: null | IWallet = yield select(getWalletInst);
    if (wallet) {
      yield call(scanWalletForTokens, wallet);
    }
  }
}

export function* updateTokenBalances(): SagaIterator {
  try {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      return;
    }

    const wallet: null | IWallet = yield select(getWalletInst);
    const tokens: MergedToken[] = yield select(getWalletConfigTokens);
    if (!wallet || !tokens.length) {
      return;
    }
    yield put(setTokenBalancesPending());
    const tokenBalances: TokenBalanceLookup = yield call(getTokenBalances, wallet, tokens);
    yield put(setTokenBalancesFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balances', error);
    yield put(setTokenBalancesRejected());
  }
}

export function* updateTokenBalance(action: SetTokenBalancePendingAction): SagaIterator {
  try {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      return;
    }

    const wallet: null | IWallet = yield select(getWalletInst);
    const { tokenSymbol } = action.payload;
    const allTokens: Token[] = yield select(getAllTokens);
    const token = allTokens.find(t => t.symbol === tokenSymbol);

    if (!wallet) {
      return;
    }

    if (!token) {
      throw Error('Token not found');
    }

    const tokenBalances: TokenBalanceLookup = yield call(getTokenBalances, wallet, [token]);

    yield put(setTokenBalanceFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balance', error);
    yield put(setTokenBalanceRejected());
  }
}

export function* handleScanWalletAction(action: ScanWalletForTokensAction): SagaIterator {
  yield call(scanWalletForTokens, action.payload);
}

export function* scanWalletForTokens(wallet: IWallet): SagaIterator {
  try {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      return;
    }

    const tokens: MergedToken[] = yield select(getTokens);
    yield put(setTokenBalancesPending());

    // Fetch all token balances, save ones we want to the config
    const balances: TokenBalanceLookup = yield call(getTokenBalances, wallet, tokens);
    const tokensToSave: string[] = yield call(filterScannedTokenBalances, wallet, balances);
    const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: tokensToSave });
    yield put(setWalletConfig(config));

    yield put(setTokenBalancesFulfilled(balances));
  } catch (err) {
    console.error('Failed to scan for tokens', err);
    yield put(setTokenBalancesRejected());
  }
}

export function* handleSetWalletTokens(action: SetWalletTokensAction): SagaIterator {
  const wallet: null | IWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }

  const config: WalletConfig = yield call(saveWalletConfig, wallet, { tokens: action.payload });
  yield put(setWalletConfig(config));
}

export function* updateBalances(): SagaIterator {
  const updateAccount = yield fork(updateAccountBalance);
  const updateToken = yield fork(updateTokenBalances);

  yield take(TypeKeys.WALLET_SET);
  yield cancel(updateAccount);
  yield cancel(updateToken);
}

export function* handleNewWallet(): SagaIterator {
  yield call(updateWalletConfig);
  yield fork(updateBalances);
}

export function* updateWalletConfig(): SagaIterator {
  const wallet: null | IWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }
  const config: WalletConfig = yield call(loadWalletConfig, wallet);
  yield put(setWalletConfig(config));
}

export function* unlockPrivateKey(action: UnlockPrivateKeyAction): SagaIterator {
  let wallet: IWallet | null = null;
  const { key, password } = action.payload;

  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(setWallet(wallet));
}

export function* startLoadingSpinner(): SagaIterator {
  yield call(delay, 400);
  yield put(setWalletPending(true));
}

export function* stopLoadingSpinner(loadingFork: Task | null): SagaIterator {
  if (loadingFork !== null && loadingFork !== undefined) {
    yield cancel(loadingFork);
  }
  yield put(setWalletPending(false));
}

export function* unlockKeystore(action: UnlockKeystoreAction): SagaIterator {
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
      yield put(setPasswordPrompt());
    } else {
      yield put(showNotification('danger', translate('ERROR_6')));
    }
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  yield call(stopLoadingSpinner, spinnerTask);
  yield put(setWallet(wallet));
}

export function* unlockMnemonic(action: UnlockMnemonicAction): SagaIterator {
  let wallet;
  const { phrase, pass, path, address } = action.payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    yield put(showNotification('danger', translate('ERROR_14')));
    return;
  }

  yield put(setWallet(wallet));
}

export function* handleCustomTokenAdd(action: AddCustomTokenAction): SagaIterator {
  // Add the custom token to our current wallet's config
  const wallet: null | IWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }
  const oldConfig: WalletConfig = yield call(loadWalletConfig, wallet);
  const config: WalletConfig = yield call(saveWalletConfig, wallet, {
    tokens: [...(oldConfig.tokens || []), action.payload.symbol]
  });
  yield put(setWalletConfig(config));

  // Update token balances
  yield fork(updateTokenBalances);
}

export default function* walletSaga(): SagaIterator {
  yield [
    takeEvery(TypeKeys.WALLET_UNLOCK_PRIVATE_KEY, unlockPrivateKey),
    takeEvery(TypeKeys.WALLET_UNLOCK_KEYSTORE, unlockKeystore),
    takeEvery(TypeKeys.WALLET_UNLOCK_MNEMONIC, unlockMnemonic),
    takeEvery(TypeKeys.WALLET_SET, handleNewWallet),
    takeEvery(TypeKeys.WALLET_SCAN_WALLET_FOR_TOKENS, handleScanWalletAction),
    takeEvery(TypeKeys.WALLET_SET_WALLET_TOKENS, handleSetWalletTokens),
    takeEvery(TypeKeys.WALLET_SET_TOKEN_BALANCE_PENDING, updateTokenBalance),
    takeEvery(TypeKeys.WALLET_REFRESH_ACCOUNT_BALANCE, updateAccountBalance),
    takeEvery(TypeKeys.WALLET_REFRESH_TOKEN_BALANCES, retryTokenBalances),
    // Foreign actions
    takeEvery(ConfigTypeKeys.CONFIG_TOGGLE_OFFLINE, updateBalances),
    takeEvery(CustomTokenTypeKeys.CUSTOM_TOKEN_ADD, handleCustomTokenAdd)
  ];
}
