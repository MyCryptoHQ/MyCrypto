import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { getWalletInst } from 'selectors/wallet';
import { getFromSucceeded, getFromFailed, TypeKeys as TK } from 'actions/transaction';

import { showNotification } from 'actions/notifications';
import { AppState } from 'reducers';

/*
* This function will be called during transaction serialization / signing
*/
export function* handleFromRequest(): SagaIterator {
  const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
  try {
    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);
    yield put(getFromSucceeded(fromAddress));
  } catch {
    yield put(showNotification('warning', 'Your wallets address could not be fetched'));
    yield put(getFromFailed());
  }
}

export const from = takeEvery(TK.GET_FROM_REQUESTED, handleFromRequest);
