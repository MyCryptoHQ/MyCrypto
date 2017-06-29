// @flow
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { saveWallet } from 'actions/wallet';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import PrivKeyWallet from 'libs/wallet/privkey';

function* unlockPrivateKey(action: UnlockPrivateKeyAction) {
    yield put(saveWallet(new PrivKeyWallet(action.payload)));
}

export default function* notificationsSaga() {
    yield takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey);
}
