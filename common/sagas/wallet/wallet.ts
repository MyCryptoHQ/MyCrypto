import { showNotification } from 'actions/notifications';
import {
  setBalanceFullfilled,
  setBalancePending,
  setBalanceRejected,
  setTokenBalancesPending,
  setTokenBalancesFulfilled,
  setTokenBalancesRejected,
  setWallet,
  setWalletConfig,
  UnlockKeystoreAction,
  UnlockMnemonicAction,
  UnlockPrivateKeyAction,
  ScanWalletForTokensAction,
  SetWalletTokensAction,
  TypeKeys
} from 'actions/wallet';
import { Wei } from 'libs/units';
import { changeNodeIntent, web3UnsetNode, TypeKeys as ConfigTypeKeys } from 'actions/config';
import { AddCustomTokenAction, TypeKeys as CustomTokenTypeKeys } from 'actions/customTokens';
import { INode } from 'libs/nodes/INode';
import {
  IWallet,
  MnemonicWallet,
  getPrivKeyWallet,
  getKeystoreWallet,
  Web3Wallet,
  WalletConfig
} from 'libs/wallet';
import { NODES, initWeb3Node } from 'config/data';
import { SagaIterator } from 'redux-saga';
import { apply, call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import {
  getTokens,
  getWalletInst,
  getWalletConfigTokens,
  MergedToken,
  TokenBalance
} from 'selectors/wallet';
import translate from 'translations';
import Web3Node, { isWeb3Node } from 'libs/nodes/web3';
import { loadWalletConfig, saveWalletConfig } from 'utils/localStorage';
import { getTokenBalances, filterScannedTokenBalances } from './helpers';

export interface TokenBalanceLookup {
  [symbol: string]: TokenBalance;
}

export function* updateAccountBalance(): SagaIterator {
  try {
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

export function* updateTokenBalances(): SagaIterator {
  try {
    const wallet: null | IWallet = yield select(getWalletInst);
    const tokens: MergedToken[] = yield select(getWalletConfigTokens);
    if (!wallet || !tokens.length) {
      return;
    }
    yield put(setTokenBalancesPending());
    const tokenBalances: TokenBalanceLookup = yield call(getTokenBalances, wallet, tokens);
    console.log(tokenBalances);
    yield put(setTokenBalancesFulfilled(tokenBalances));
  } catch (error) {
    console.error('Failed to get token balances', error);
    yield put(setTokenBalancesRejected());
  }
}

export function* scanWalletForTokens(action: ScanWalletForTokensAction): SagaIterator {
  try {
    const wallet = action.payload;
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
  yield fork(updateAccountBalance);
  yield fork(updateTokenBalances);
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

export function* unlockKeystore(action: UnlockKeystoreAction): SagaIterator {
  const { file, password } = action.payload;
  let wallet: null | IWallet = null;

  try {
    wallet = getKeystoreWallet(file, password);
  } catch (e) {
    yield put(showNotification('danger', translate('ERROR_6')));
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
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

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    yield call(initWeb3Node);
    yield put(changeNodeIntent('web3'));
    yield take(
      action =>
        action.type === ConfigTypeKeys.CONFIG_NODE_CHANGE && action.payload.nodeSelection === 'web3'
    );

    const network = NODES.web3.network;
    const nodeLib: INode | Web3Node = yield select(getNodeLib);

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = yield apply(nodeLib, nodeLib.getAccounts);
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Mist.');
    }
    const wallet = new Web3Wallet(address, network);
    yield put(setWallet(wallet));
  } catch (err) {
    // unset web3 node so node dropdown isn't disabled
    yield put(web3UnsetNode());
    yield put(showNotification('danger', translate(err.message)));
  }
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
    takeEvery(TypeKeys.WALLET_UNLOCK_WEB3, unlockWeb3),
    takeEvery(TypeKeys.WALLET_SET, handleNewWallet),
    takeEvery(TypeKeys.WALLET_SCAN_WALLET_FOR_TOKENS, scanWalletForTokens),
    takeEvery(TypeKeys.WALLET_SET_WALLET_TOKENS, handleSetWalletTokens),
    takeEvery(CustomTokenTypeKeys.CUSTOM_TOKEN_ADD, handleCustomTokenAdd)
  ];
}
