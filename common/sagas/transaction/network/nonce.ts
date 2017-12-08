import { getNonceSucceeded, getNonceFailed, TypeKeys as TK, inputNonce } from 'actions/transaction';
import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { getNodeLib } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { showNotification } from 'actions/notifications';

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

export const nonce = takeEvery(TK.GET_NONCE_REQUESTED, handleNonceRequest);
