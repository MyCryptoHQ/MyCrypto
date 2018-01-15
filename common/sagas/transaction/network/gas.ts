import { SagaIterator, buffers, delay } from 'redux-saga';
import { apply, put, select, take, actionChannel, call, fork, race } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { getNodeLib, getOffline, getAutoGasLimitEnabled } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { getTransaction, IGetTransaction } from 'selectors/transaction';
import {
  EstimateGasRequestedAction,
  setGasLimitField,
  estimateGasFailed,
  estimateGasTimedout,
  estimateGasSucceeded,
  TypeKeys,
  estimateGasRequested,
  SetToFieldAction,
  SetDataFieldAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapTokenToEtherAction
} from 'actions/transaction';
import { TypeKeys as ConfigTypeKeys, ToggleAutoGasLimitAction } from 'actions/config';
import { IWallet } from 'libs/wallet';
import { makeTransaction, getTransactionFields, IHexStrTransaction } from 'libs/transaction';

export function* shouldEstimateGas(): SagaIterator {
  while (true) {
    const action:
      | SetToFieldAction
      | SetDataFieldAction
      | SwapEtherToTokenAction
      | SwapTokenToTokenAction
      | SwapTokenToEtherAction
      | ToggleAutoGasLimitAction = yield take([
      TypeKeys.TO_FIELD_SET,
      TypeKeys.DATA_FIELD_SET,
      TypeKeys.ETHER_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_TOKEN_SWAP,
      TypeKeys.TOKEN_TO_ETHER_SWAP,
      ConfigTypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT
    ]);
    // invalid field is a field that the value is null and the input box isnt empty
    // reason being is an empty field is valid because it'll be null

    const isOffline: boolean = yield select(getOffline);
    const autoGasLimitEnabled: boolean = yield select(getAutoGasLimitEnabled);

    if (isOffline || !autoGasLimitEnabled) {
      continue;
    }

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
    const autoGasLimitEnabled: boolean = yield select(getAutoGasLimitEnabled);
    const isOffline = yield select(getOffline);

    if (isOffline || !autoGasLimitEnabled) {
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
      const { gasLimit } = yield race({
        gasLimit: apply(node, node.estimateGas, [txObj]),
        timeout: call(delay, 10000)
      });
      if (gasLimit) {
        yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
        yield put(estimateGasSucceeded());
      } else {
        yield put(estimateGasTimedout());
        yield call(localGasEstimation, payload);
      }
    } catch (e) {
      yield put(estimateGasFailed());
      yield call(localGasEstimation, payload);
    }
  }
}

export function* localGasEstimation(payload: EstimateGasRequestedAction['payload']) {
  const tx = yield call(makeTransaction, payload);
  const gasLimit = yield apply(tx, tx.getBaseFee);
  yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
}

export const gas = [fork(shouldEstimateGas), fork(estimateGas)];
