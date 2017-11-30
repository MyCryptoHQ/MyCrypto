import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { getWalletInst } from 'selectors/wallet';
import {
  getFromSucceeded,
  getFromFailed,
  TypeKeys as TK
} from 'actions/transaction';
import { IWallet } from 'libs/wallet';

/*
* This function will be called during transaction serialization / signing
*/
export function* handleFromRequest(): SagaIterator {
  const walletInst: IWallet = yield select(getWalletInst);
  try {
    const fromAddress: string = yield apply(
      walletInst,
      walletInst.getAddressString
    );
    yield put(getFromSucceeded(fromAddress));
  } catch (error) {
    //TODO: display notif
    yield put(getFromFailed());
  }
}

export function* from(): SagaIterator {
  yield takeEvery(TK.GET_FROM_REQUESTED, handleFromRequest);
}
