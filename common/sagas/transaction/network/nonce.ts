import { getNonceSucceeded, getNonceFailed, TypeKeys as TK, inputNonce } from 'actions/transaction';
import { SagaIterator } from 'redux-saga';
import { apply, put, select, takeEvery } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { getNodeLib, getOffline } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { showNotification } from 'actions/notifications';
import { TypeKeys as WalletTK } from 'actions/wallet';
import { Nonce } from 'libs/units';

export function* handleNonceRequest(): SagaIterator {
  const nodeLib: INode = yield select(getNodeLib);
  const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
  const isOffline: boolean = yield select(getOffline);
  try {
    if (isOffline) {
      return;
    }

    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);

    const retrievedNonce: string = yield apply(nodeLib, nodeLib.getTransactionCount, [fromAddress]);
    const base10Nonce = Nonce(retrievedNonce);
    yield put(inputNonce(base10Nonce.toString()));
    yield put(getNonceSucceeded(retrievedNonce));
  } catch {
    yield put(showNotification('warning', 'Your addresses nonce could not be fetched'));
    yield put(getNonceFailed());
  }
}

//leave get nonce requested for nonce refresh later on
export const nonce = takeEvery([TK.GET_NONCE_REQUESTED, WalletTK.WALLET_SET], handleNonceRequest);
