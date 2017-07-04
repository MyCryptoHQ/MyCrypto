// @flow
import { takeEvery, call, put, select } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { saveWallet, initWallet } from 'actions/wallet';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import { showNotification } from 'actions/notifications';
import PrivKeyWallet from 'libs/wallet/privkey';
import translate from 'translations';

function* init() {
  yield put(initWallet());
  // const node = select(getNode);
  // yield call();
  // fetch balance,
  // fetch tokens
  yield delay(100);
}

export function* unlockPrivateKey(action?: UnlockPrivateKeyAction): Generator<Effect, void, any> {
  if (!action) return;
  let wallet = null;
  try {
    wallet = new PrivKeyWallet(action.payload);
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(saveWallet(wallet));
  yield call(init);
}

export default function* notificationsSaga(): Generator<Effect, void, any> {
  yield takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey);
}
