import { SagaIterator, buffers, delay } from 'redux-saga';
import { apply, put, select, take, actionChannel, call, fork } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { getTransaction, IGetTransaction } from 'selectors/transaction';
import {
  EstimateGasRequestedAction,
  setGasLimitField,
  estimateGasFailed,
  estimateGasSucceeded,
  TypeKeys,
  estimateGasRequested
} from 'actions/transaction';
import { IWallet } from 'libs/wallet';
import { makeTransaction, getTransactionFields } from 'libs/transaction';

function* shouldEstimateGas(): SagaIterator {
  while (true) {
    yield take([
      TypeKeys.TO_FIELD_SET,
      TypeKeys.DATA_FIELD_SET,
      TypeKeys.ETHER_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_ETHER_SWAP
    ]);
    const { transaction }: IGetTransaction = yield select(getTransaction);
    const { gasLimit, gasPrice, nonce, chainId, ...rest } = yield call(
      getTransactionFields,
      transaction
    );

    yield put(estimateGasRequested(rest));
  }
}

function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(TypeKeys.ESTIMATE_GAS_REQUESTED, buffers.sliding(1));

  while (true) {
    const { payload }: EstimateGasRequestedAction = yield take(requestChan);
    // debounce 500 ms
    yield call(delay, 500);
    const node: INode = yield select(getNodeLib);
    const walletInst: IWallet = yield select(getWalletInst);
    try {
      const from: string = yield apply(walletInst, walletInst.getAddressString);
      const txObj = { ...payload, from };
      const gasLimit = yield apply(node, node.estimateGas, [txObj]);
      yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
      yield put(estimateGasSucceeded());
    } catch {
      //TODO: display notif

      yield put(estimateGasFailed());
      // fallback for estimating locally
      const tx = yield call(makeTransaction, payload);
      const gasLimit = yield apply(tx, tx.getBaseFee);
      yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
    }
  }
}

export const gas = [fork(shouldEstimateGas), fork(estimateGas)];
