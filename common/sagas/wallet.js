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
import {
  PresaleWallet,
  MewV1Wallet,
  UtcWallet,
  EncryptedPrivKeyWallet,
  PrivKeyWallet,
  BaseWallet
} from 'libs/wallet';
import { BaseNode } from 'libs/nodes';
import { getNodeLib } from 'selectors/config';
import { getWalletInst, getTokens } from 'selectors/wallet';

import { determineKeystoreType } from 'libs/keystore';

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
    if (action.payload.key.length === 64) {
      wallet = new PrivKeyWallet(Buffer.from(action.payload.key, 'hex'));
    } else {
      wallet = new EncryptedPrivKeyWallet(
        action.payload.key,
        action.payload.password
      );
    }
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

  const file = action.payload.file;
  const pass = action.payload.password;
  let wallet = null;

  try {
    const parsed = JSON.parse(file);

    switch (determineKeystoreType(file)) {
      case 'presale':
        wallet = new PresaleWallet(file, pass);
        break;
      case 'v1-unencrypted':
        wallet = new PrivKeyWallet(Buffer.from(parsed.private, 'hex'));
        break;
      case 'v1-encrypted':
        wallet = new MewV1Wallet(file, pass);
        break;
      case 'v2-unencrypted':
        wallet = new PrivKeyWallet(Buffer.from(parsed.privKey, 'hex'));
        break;
      case 'v2-v3-utc':
        wallet = new UtcWallet(file, pass);
        break;
      default:
        yield put(showNotification('danger', translate('ERROR_6')));
        return;
    }
  } catch (e) {
    yield put(showNotification('danger', translate('ERROR_6')));
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above

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
