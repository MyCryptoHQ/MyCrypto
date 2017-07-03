// @flow
import { takeEvery, call, put, select } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { saveWallet, initWallet } from 'actions/wallet';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import PrivKeyWallet from 'libs/wallet/privkey';

function* init() {
    yield put(initWallet());
    // const node = select(node);
    // yield call();
    // fetch balance,
    // fetch tokens
    yield delay(100);
}

function* unlockPrivateKey(action?: UnlockPrivateKeyAction) {
    if (!action) return;
    yield put(saveWallet(new PrivKeyWallet(action.payload)));
    yield call(init);
}

export default function* notificationsSaga(): Generator<Effect, void, any> {
    yield takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey);
}
