import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { getWalletInst } from 'selectors/wallet';
import {
  getFromSucceeded,
  getFromFailed,
  getNonceSucceeded,
  getNonceFailed,
  TypeKeys as TK,
  inputNonce
} from 'actions/transaction';

import { getNodeLib } from 'selectors/config';
import { INode } from 'libs/nodes/INode';
import { showNotification } from 'actions/notifications';
import { AppState } from 'reducers';

/*
* This function will be called during transaction serialization / signing
*/
function* handleFromRequest(): SagaIterator {
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

export function* from(): SagaIterator {
  yield takeEvery(TK.GET_FROM_REQUESTED, handleFromRequest);
}

function* handleNonceRequest(): SagaIterator {
  const nodeLib: INode = yield select(getNodeLib);
  const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
  try {
    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);

    const retrievedNonce: string = yield apply(nodeLib, nodeLib.getTransactionCount, [fromAddress]);
    yield put(inputNonce(retrievedNonce));
    yield put(getNonceSucceeded(retrievedNonce));
  } catch {
    yield put(showNotification('warning', 'Your addresses nonce could not be fetched'));
    yield put(getNonceFailed());
  }
}

export function* nonce(): SagaIterator {
  yield takeEvery(TK.GET_NONCE_REQUESTED, handleNonceRequest);
}
