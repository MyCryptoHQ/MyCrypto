import { SagaIterator, buffers, delay } from 'redux-saga';
import { apply, put, select, take, actionChannel, call, fork } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { getNodeLib, getOffline } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { getTransaction, IGetTransaction } from 'selectors/transaction';
import {
  EstimateGasRequestedAction,
  setGasLimitField,
  estimateGasFailed,
  estimateGasSucceeded,
  TypeKeys,
  estimateGasRequested,
  SetToFieldAction,
  SetDataFieldAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapTokenToEtherAction
} from 'actions/transaction';
import { IWallet } from 'libs/wallet';
import { makeTransaction, getTransactionFields, IHexStrTransaction } from 'libs/transaction';

export function* shouldEstimateGas(): SagaIterator {
  while (true) {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      continue;
    }

    const action:
      | SetToFieldAction
      | SetDataFieldAction
      | SwapEtherToTokenAction
      | SwapTokenToTokenAction
      | SwapTokenToEtherAction = yield take([
      TypeKeys.TO_FIELD_SET,
      TypeKeys.DATA_FIELD_SET,
      TypeKeys.ETHER_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_ETHER_SWAP
    ]);
    // invalid field is a field that the value is null and the input box isnt empty
    // reason being is an empty field is valid because it'll be null

    const invalidField =
      (action.type === TypeKeys.TO_FIELD_SET || action.type === TypeKeys.DATA_FIELD_SET) &&
      !action.payload.value &&
      action.payload.raw !== '';

    if (invalidField) {
      continue;
    }
    const { transaction }: IGetTransaction = yield select(getTransaction);

    const { gasLimit, gasPrice, nonce, chainId, ...rest }: IHexStrTransaction = yield call(
      getTransactionFields,
      transaction
    );
    yield put(estimateGasRequested(rest));
  }
}

export function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(TypeKeys.ESTIMATE_GAS_REQUESTED, buffers.sliding(1));

  while (true) {
    const isOffline = yield select(getOffline);
    if (isOffline) {
      continue;
    }

    const { payload }: EstimateGasRequestedAction = yield take(requestChan);
    // debounce 250 ms
    yield call(delay, 250);
    const node: INode = yield select(getNodeLib);
    const walletInst: IWallet = yield select(getWalletInst);
    try {
      const from: string = yield apply(walletInst, walletInst.getAddressString);
      const txObj = { ...payload, from };
      const gasLimit = yield apply(node, node.estimateGas, [txObj]);
      yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
      yield put(estimateGasSucceeded());
    } catch (e) {
      yield put(estimateGasFailed());
      // fallback for estimating locally
      const tx = yield call(makeTransaction, payload);
      const gasLimit = yield apply(tx, tx.getBaseFee);
      yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
    }
  }
}

export const gas = [fork(shouldEstimateGas), fork(estimateGas)];
