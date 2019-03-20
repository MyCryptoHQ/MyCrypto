import BN from 'bn.js';
import { SagaIterator, buffers, delay } from 'redux-saga';
import {
  apply,
  put,
  select,
  take,
  actionChannel,
  call,
  fork,
  race,
  cancel,
  takeEvery
} from 'redux-saga/effects';

import { AddressMessage } from 'config';
import { INode } from 'libs/nodes/INode';
import { IWallet } from 'libs/wallet';
import { Nonce } from 'libs/units';
import { hexStringToNumber } from 'utils/formatters';
import { makeTransaction, getTransactionFields, IHexStrTransaction } from 'libs/transaction';
import { IGetTransaction } from 'features/types';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { configMetaTypes, configMetaSelectors, configNodesSelectors } from 'features/config';
import { walletTypes, walletSelectors } from 'features/wallet';
import { scheduleActions, scheduleSelectors, scheduleTypes } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsTypes, transactionFieldsActions } from '../fields';
import { transactionsSelectors } from 'features/transactions';
import * as transactionTypes from '../types';
import * as types from './types';
import * as actions from './actions';

//#region From
/*
* This function will be called during transaction serialization / signing
*/
export function* handleFromRequest(): SagaIterator {
  const walletInst: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
  try {
    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);
    yield put(actions.getFromSucceeded(fromAddress));
  } catch {
    yield put(
      notificationsActions.showNotification('warning', 'Your wallets address could not be fetched')
    );
    yield put(actions.getFromFailed());
  }
}

export const fromSaga = takeEvery(
  types.TransactionNetworkActions.GET_FROM_REQUESTED,
  handleFromRequest
);
//#endregion From

//#region Gas
export function* shouldEstimateGas(): SagaIterator {
  while (true) {
    const action:
      | transactionFieldsTypes.SetToFieldAction
      | transactionFieldsTypes.SetValueFieldAction
      | transactionFieldsTypes.SetDataFieldAction
      | transactionTypes.SwapEtherToTokenAction
      | transactionTypes.SwapTokenToTokenAction
      | transactionTypes.SwapTokenToEtherAction
      | configMetaTypes.ToggleAutoGasLimitAction
      | scheduleTypes.SetSchedulingToggleAction = yield take([
      transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
      transactionTypes.TransactionActions.ETHER_TO_TOKEN_SWAP,
      transactionTypes.TransactionActions.TOKEN_TO_TOKEN_SWAP,
      transactionTypes.TransactionActions.TOKEN_TO_ETHER_SWAP,
      configMetaTypes.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT,
      scheduleTypes.ScheduleActions.TOGGLE_SET
    ]);

    const isOffline: boolean = yield select(configMetaSelectors.getOffline);
    const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
    const message: AddressMessage | undefined = yield select(
      derivedSelectors.getCurrentToAddressMessage
    );

    if (isOffline || !autoGasLimitEnabled || (message && message.gasLimit)) {
      continue;
    }

    // invalid field is a field that the value is null and the input box isnt empty
    // reason being is an empty field is valid because it'll be null
    const invalidField =
      (action.type === transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET ||
        action.type === transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET ||
        action.type === transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET) &&
      !action.payload.value &&
      action.payload.raw !== '';

    if (invalidField) {
      continue;
    }
    const { transaction }: IGetTransaction = yield select(derivedSelectors.getTransaction);

    const { gasLimit, gasPrice, nonce, chainId, ...rest }: IHexStrTransaction = yield call(
      getTransactionFields,
      transaction
    );

    // gas estimation calls with
    // '0x' as an address (contract creation)
    // fail, so instead we set it as undefined
    // interestingly, the transaction itself as '0x' as the
    // to address works fine.
    if (rest.to === '0x') {
      rest.to = undefined as any;
    }

    const scheduling: boolean = yield select(scheduleSelectors.isSchedulingEnabled);

    if (scheduling) {
      yield put(scheduleActions.estimateSchedulingGasRequested(rest));
    } else {
      yield put(actions.estimateGasRequested(rest));
    }
  }
}

export function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(
    types.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
    const isOffline = yield select(configMetaSelectors.getOffline);

    if (isOffline || !autoGasLimitEnabled) {
      continue;
    }

    const { payload }: types.EstimateGasRequestedAction = yield take(requestChan);
    // debounce 250 ms
    yield call(delay, 250);
    const node: INode = yield select(configNodesSelectors.getNodeLib);
    const walletInst: IWallet = yield select(walletSelectors.getWalletInst);
    try {
      const from: string = yield apply(walletInst, walletInst.getAddressString);
      const txObj = { ...payload, from };

      const { gasLimit } = yield race({
        gasLimit: apply(node, node.estimateGas, [txObj]),
        timeout: call(delay, 10000)
      });
      if (gasLimit) {
        const gasSetOptions = {
          raw: gasLimit.toString(),
          value: gasLimit
        };

        yield put(transactionFieldsActions.setGasLimitField(gasSetOptions));

        yield put(actions.estimateGasSucceeded());
      } else {
        yield put(actions.estimateGasTimedout());
        yield call(localGasEstimation, payload);
      }
    } catch (e) {
      yield put(actions.estimateGasFailed());
      yield call(localGasEstimation, payload);
    }
  }
}

export function* localGasEstimation(payload: types.EstimateGasRequestedAction['payload']) {
  const tx = yield call(makeTransaction, payload);
  const gasLimit = yield apply(tx, tx.getBaseFee);
  yield put(
    transactionFieldsActions.setGasLimitField({ raw: gasLimit.toString(), value: gasLimit })
  );
}

export function* setAddressMessageGasLimit() {
  const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
  const message: AddressMessage | undefined = yield select(
    derivedSelectors.getCurrentToAddressMessage
  );
  if (autoGasLimitEnabled && message && message.gasLimit) {
    yield put(
      transactionFieldsActions.setGasLimitField({
        raw: message.gasLimit.toString(),
        value: new BN(message.gasLimit)
      })
    );
  }
}

export const gas = [
  fork(shouldEstimateGas),
  fork(estimateGas),
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET, setAddressMessageGasLimit)
];
//#endregion Gas

//#region Nonce
export function* handleNonceRequest(): SagaIterator {
  const nodeLib: INode = yield select(configNodesSelectors.getNodeLib);
  const walletInst: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
  const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  try {
    if (isOffline || !walletInst) {
      return;
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);
    const transactionCountString: string = yield apply(nodeLib, nodeLib.getTransactionCount, [
      fromAddress
    ]);
    const transactionCount: number = yield call(hexStringToNumber, transactionCountString);
    const recentTransactions: AppState['transactions']['recent'] = yield select(
      transactionsSelectors.getRecentTransactions
    );
    const retrievedNonce = yield call(
      conductMaxNonceCheck,
      transactionCount,
      fromAddress,
      recentTransactions
    );
    const base10Nonce = Nonce(retrievedNonce);
    yield put(transactionFieldsActions.inputNonce(base10Nonce.toString()));
    yield put(actions.getNonceSucceeded(retrievedNonce));
  } catch {
    yield put(
      notificationsActions.showNotification('warning', 'Your addresses nonce could not be fetched')
    );
    yield put(actions.getNonceFailed());
  }
}

export function* conductMaxNonceCheck(
  transactionCount: number,
  fromAddress: string,
  recentTransactions: AppState['transactions']['recent']
): SagaIterator {
  // Selects the maximum nonce from the maximum of the recent-transaction nonces with the same `from` address and the transaction count of the address
  const selectedNonce = Math.max(
    transactionCount,
    Math.max(
      Math.max(
        ...recentTransactions
          .filter(entry => entry.from === fromAddress.toLowerCase())
          .filter(entry => entry.nonce)
          .filter(entry => typeof entry.nonce === 'number')
          .map(entry => entry.nonce + 1)
      ),
      0
    )
  ).toString();
  return selectedNonce;
}

export function* handleNonceRequestWrapper(): SagaIterator {
  const nonceRequest = yield fork(handleNonceRequest);

  yield take(walletTypes.WalletActions.SET);
  yield cancel(nonceRequest);
}

//leave get nonce requested for nonce refresh later on
export const nonceSaga = takeEvery(
  [types.TransactionNetworkActions.GET_NONCE_REQUESTED, walletTypes.WalletActions.SET],
  handleNonceRequestWrapper
);
//#endregion Nonce

export const networkSaga = [fromSaga, ...gas, nonceSaga];
