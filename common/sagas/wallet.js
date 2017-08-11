// @flow
import { takeEvery, call, apply, put, select, fork } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { setWallet, setBalance, setTokenBalances } from 'actions/wallet';
import type {
  UnlockPrivateKeyAction,
  UnlockKeystoreAction
} from 'actions/wallet';
import { showNotification } from 'actions/notifications';
import translate from 'translations';
import { KeystoreWallet, PrivKeyWallet, BaseWallet } from 'libs/wallet';
import { BaseNode } from 'libs/nodes';
import { getNodeLib } from 'selectors/config';
import { getWalletInst, getTokens } from 'selectors/wallet';

function* updateAccountBalance() {
  const node: BaseNode = yield select(getNodeLib);
  const wallet: ?BaseWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }
  const address = yield wallet.getAddress();
  let balance = yield apply(node, node.getBalance, [address]);
  yield put(setBalance(balance));
}

function* updateTokenBalances() {
  const node: BaseNode = yield select(getNodeLib);
  const wallet: ?BaseWallet = yield select(getWalletInst);
  const tokens = yield select(getTokens);
  if (!wallet || !node) {
    return;
  }
  // FIXME handle errors
  const address = yield wallet.getAddress();
  const tokenBalances = yield apply(node, node.getTokenBalances, [
    address,
    tokens
  ]);
  yield put(
    setTokenBalances(
      tokens.reduce((acc, t, i) => {
        acc[t.symbol] = tokenBalances[i];
        return acc;
      }, {})
    )
  );
}

function* updateBalances() {
  yield fork(updateAccountBalance);
  yield fork(updateTokenBalances);
}

export function* unlockPrivateKey(
  action?: UnlockPrivateKeyAction
): Generator<Effect, void, any> {
  if (!action) return;
  let wallet = null;

  try {
    wallet = new PrivKeyWallet(Buffer.from(action.payload.key, 'hex'));
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(setWallet(wallet));
  yield call(updateBalances);
}

export function* unlockKeystore(
  action?: UnlockKeystoreAction
): Generator<Effect, void, any> {
  if (!action) return;
  let wallet = null;

  try {
    wallet = new KeystoreWallet(action.payload.file, action.payload.password);
  } catch (e) {
    yield put(showNotification('danger', translate('ERROR_6'))); //invalid password message
    return;
  }
  yield put(setWallet(wallet));
  yield call(updateBalances);
}

export default function* walletSaga(): Generator<Effect | Effect[], void, any> {
  // useful for development
  yield call(updateBalances);
  yield [
    takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey),
    takeEvery('WALLET_UNLOCK_KEYSTORE', unlockKeystore),
    takeEvery('CUSTOM_TOKEN_ADD', updateTokenBalances)
  ];
}
