import { SagaIterator, buffers, delay } from 'redux-saga';
import {
  apply,
  put,
  select,
  take,
  actionChannel,
  call
} from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import {
  EstimateGasRequestedAction,
  setGasLimitField,
  estimateGasFailed,
  estimateGasSucceeded,
  TypeKeys
} from 'actions/transaction';
import EthTx from 'ethereumjs-tx';
import { IWallet } from 'libs/wallet';

export function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(
    TypeKeys.ESTIMATE_GAS_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const { payload }: EstimateGasRequestedAction = yield take(requestChan);
    // debounce 500 ms
    yield call(delay, 500);
    const node: INode = yield select(getNodeLib);
    const walletInst: IWallet = yield select(getWalletInst);
    try {
      const from = yield apply(walletInst, walletInst.getAddressString);
      const txObj = { ...payload, from };
      const gasLimit = yield apply(node, node.estimateGas, [txObj]);
      yield put(
        setGasLimitField({ raw: gasLimit.toString(), value: gasLimit })
      );
      yield put(estimateGasSucceeded());
    } catch {
      yield put(estimateGasFailed());
      // fallback for estimating locally
      const gasLimit = new EthTx(payload).getBaseFee();
      yield put(
        setGasLimitField({ raw: gasLimit.toString(), value: gasLimit })
      );
    }
  }
}
