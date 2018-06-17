import React from 'react';
import Tx from 'ethereumjs-tx';
import { SagaIterator } from 'redux-saga';
import { select, call, put, take } from 'redux-saga/effects';
import { bufferToHex } from 'ethereumjs-util';

import { TokenValue, Wei, toTokenBase } from 'libs/units';
import { IFullWallet } from 'libs/wallet';
import {
  computeIndexingHash,
  ITransaction,
  enoughBalanceViaTx,
  enoughTokensViaInput,
  makeTransaction
} from 'libs/transaction';
import { validNumber, validDecimal } from 'libs/validators';
import { NetworkConfig, StaticNetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { getOffline } from 'features/config/meta/selectors';
import { isNetworkUnit, getNetworkConfig } from 'features/config/selectors';
import { scheduleSelectors } from 'features/schedule';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import {
  transactionBroadcastTypes,
  transactionBroadcastActions,
  transactionBroadcastSelectors
} from './broadcast';
import { transactionFieldsActions, transactionFieldsSelectors } from './fields';
import { transactionNetworkTypes, transactionNetworkActions } from './network';
import {
  transactionSignTypes,
  transactionSignActions,
  transactionSignReducer,
  transactionSignSelectors
} from './sign';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';

//#region Selectors
type TransactionFields = AppState['transaction']['fields'];

export type TransactionFieldValues = {
  [field in keyof TransactionFields]: TransactionFields[field]['value']
};

export const reduceToValues = (transactionFields: AppState['transaction']['fields']) =>
  Object.keys(transactionFields).reduce<TransactionFieldValues>(
    (obj, currFieldName: keyof TransactionFields) => {
      const currField = transactionFields[currFieldName];
      return { ...obj, [currFieldName]: currField.value };
    },
    {} as TransactionFieldValues
  );

export const isFullTx = (
  state: AppState,
  transactionFields: AppState['transaction']['fields'],
  currentTo: selectors.ICurrentTo,
  currentValue: selectors.ICurrentValue,
  dataExists: boolean,
  validGasCost: boolean,
  unit: string // if its ether, we can have empty data, if its a token, we cant have value
) => {
  const { data, value, to, ...rest } = transactionFields;
  const partialParamsToCheck = { ...rest };

  const validPartialParams = Object.values(partialParamsToCheck).reduce<boolean>(
    (
      isValid,
      v: AppState['transaction']['fields'] & selectors.ICurrentTo & selectors.ICurrentValue
    ) => isValid && !!v.value,
    true
  );

  if (isNetworkUnit(state, unit)) {
    // if theres data we can have no current value, and we dont have to check for a to address
    if (dataExists && validGasCost && !currentValue.value && currentValue.raw === '') {
      return validPartialParams;
    } else if (dataExists && validGasCost && !to.value && to.raw === '') {
      // same goes for value transactions to 0x
      return !!(validPartialParams && currentValue.value);
    } else {
      // otherwise we require value
      return !!(validPartialParams && currentValue.value && to.value && currentTo.value);
    }
  } else {
    return !!(
      validPartialParams &&
      data.value &&
      !value.value &&
      currentValue.value &&
      to.value &&
      currentTo.value
    );
  }
};
//#endregion Selectors

//#region Sagas

//#region Broadcast
export const broadcastTransactionWrapper = (func: (serializedTx: string) => SagaIterator) =>
  function* handleBroadcastTransaction(action: transactionBroadcastTypes.BroadcastRequestedAction) {
    const {
      indexingHash,
      serializedTransaction
    }: transactionBroadcastTypes.ISerializedTxAndIndexingHash = yield call(
      getSerializedTxAndIndexingHash,
      action
    );

    try {
      const shouldBroadcast: boolean = yield call(shouldBroadcastTransaction, indexingHash);
      if (!shouldBroadcast) {
        yield put(
          notificationsActions.showNotification(
            'warning',
            'TxHash identical: This transaction has already been broadcasted or is broadcasting'
          )
        );
        yield put(transactionFieldsActions.resetTransactionRequested());
        return;
      }
      const queueAction = transactionBroadcastActions.broadcastTransactionQueued({
        indexingHash,
        serializedTransaction
      });
      yield put(queueAction);
      const stringTx: string = yield call(bufferToHex, serializedTransaction);
      const broadcastedHash: string = yield call(func, stringTx); // convert to string because node / web3 doesnt support buffers
      yield put(
        transactionBroadcastActions.broadcastTransactionSucceeded({ indexingHash, broadcastedHash })
      );

      const network: NetworkConfig = yield select(getNetworkConfig);
      const scheduling: boolean = yield select(scheduleSelectors.isSchedulingEnabled);
      yield put(
        notificationsActions.showNotification(
          'success',
          <TransactionSucceeded
            txHash={broadcastedHash}
            blockExplorer={network.isCustom ? undefined : network.blockExplorer}
            scheduling={scheduling}
          />,
          Infinity
        )
      );
    } catch (error) {
      yield put(transactionBroadcastActions.broadcastTransactionFailed({ indexingHash }));
      yield put(notificationsActions.showNotification('danger', (error as Error).message));
    }
  };

export function* shouldBroadcastTransaction(indexingHash: string): SagaIterator {
  const existingTx: transactionBroadcastTypes.ITransactionStatus | null = yield select(
    transactionBroadcastSelectors.getTransactionStatus,
    indexingHash
  );
  // if the transaction already exists
  if (existingTx) {
    // and is still broadcasting or already broadcasting, dont re-broadcast
    if (existingTx.isBroadcasting || existingTx.broadcastSuccessful) {
      return false;
    }
  }
  return true;
}
export function* getSerializedTxAndIndexingHash({
  type
}: transactionBroadcastTypes.BroadcastRequestedAction): SagaIterator {
  const isWeb3Req =
    type === transactionBroadcastTypes.TransactionBroadcastActions.WEB3_TRANSACTION_REQUESTED;
  const txSelector = isWeb3Req
    ? transactionSignSelectors.getWeb3Tx
    : transactionSignSelectors.getSignedTx;
  const serializedTransaction: transactionSignReducer.StateSerializedTx = yield select(txSelector);

  if (!serializedTransaction) {
    throw Error('Can not broadcast: tx does not exist');
  }

  // grab the hash without the signature, we're going to index by this
  const indexingHash = yield call(computeIndexingHash, serializedTransaction);

  return { serializedTransaction, indexingHash };
}
//#endregion Broadcast

//#region Signing
export interface IFullWalletAndTransaction {
  wallet: IFullWallet;
  tx: Tx;
}

export const signTransactionWrapper = (
  func: (IWalletAndTx: IFullWalletAndTransaction) => SagaIterator
) =>
  function*(partialTx: transactionSignTypes.SignTransactionRequestedAction) {
    try {
      const IWalletAndTx: IFullWalletAndTransaction = yield call(
        getWalletAndTransaction,
        partialTx.payload
      );
      yield call(getFromSaga);
      yield call(func, IWalletAndTx);
    } catch (err) {
      yield call(handleFailedTransaction, err);
    }
  };

/**
 * @description grabs wallet and required tx parameters via selectors, and assigns
 * the rest of the tx parameters from the action
 * @param partialTx
 */
export function* getWalletAndTransaction(
  partialTx: transactionSignTypes.SignTransactionRequestedAction['payload']
): SagaIterator {
  // get the wallet we're going to sign with
  const wallet: null | IFullWallet = yield select(walletSelectors.getWalletInst);
  if (!wallet) {
    throw Error('Could not get wallet instance to sign transaction');
  }
  // get the chainId
  const { chainId }: StaticNetworkConfig = yield select(getNetworkConfig);

  // get the rest of the transaction parameters
  partialTx._chainId = chainId;
  return {
    wallet,
    tx: partialTx
  };
}

export function* handleFailedTransaction(err: Error): SagaIterator {
  yield put(notificationsActions.showNotification('danger', err.message, 5000));
  yield put(transactionSignActions.signTransactionFailed());
}

export function* getFromSaga(): SagaIterator {
  yield put(transactionNetworkActions.getFromRequested());
  // wait for it to finish
  const {
    type
  }:
    | transactionNetworkTypes.GetFromFailedAction
    | transactionNetworkTypes.GetFromSucceededAction = yield take([
    transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED,
    transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED
  ]);
  // continue if it doesnt fail
  if (type === transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED) {
    throw Error('Could not get "from" address of wallet');
  }
}
//#endregion Signing

//#region Validation
export interface IInput {
  raw: string;
  value: Wei | TokenValue | null;
}

/**
 * @description Takes in an input, and rebases it to a new decimal, rebases the raw input if it's a valid number. This is used in the process of switching units, as the previous invalid raw input of a user now may become valid depending if the user's balances on the new unit is high enough
 * @param {IInput} value
 * @returns {SagaIterator}
 */
export function* rebaseUserInput(value: IInput): SagaIterator {
  const unit: string = yield select(selectors.getUnit);
  // get decimal
  const newDecimal: number = yield select(selectors.getDecimalFromUnit, unit);

  if (validNumber(parseInt(value.raw, 10)) && validDecimal(value.raw, newDecimal)) {
    return {
      raw: value.raw,
      value: toTokenBase(value.raw, newDecimal)
    };
  } else {
    return {
      raw: value.raw,
      value: null
    };
  }
}

export function* validateInput(input: TokenValue | Wei | null, unit: string): SagaIterator {
  if (!input) {
    return false;
  }

  const etherBalance: Wei | null = yield select(walletSelectors.getEtherBalance);
  const isOffline: boolean = yield select(getOffline);
  const networkUnitTransaction: boolean = yield select(isNetworkUnit, unit);

  if (isOffline || !etherBalance) {
    return true;
  }

  let valid = true;

  // TODO: do gas estimation here if we're switching to a token too, it should cover the last edge case

  //make a new transaction for validating ether balances
  const validationTx = networkUnitTransaction
    ? yield call(makeCostCalculationTx, input)
    : yield call(makeCostCalculationTx, null);

  // check that they have enough ether, this checks gas cost too
  valid = valid && enoughBalanceViaTx(validationTx, etherBalance);

  if (!networkUnitTransaction) {
    const tokenBalance: TokenValue | null = yield select(selectors.getTokenBalance, unit);
    valid = valid && enoughTokensViaInput(input, tokenBalance);
  }

  return valid;
}

/**
 * @description Creates a minimum viable transaction for calculating costs for validating user balances
 * @param {(Wei | null)} value
 * @returns {SagaIterator}
 */
export function* makeCostCalculationTx(
  value: AppState['transaction']['fields']['value']['value']
): SagaIterator {
  const gasLimit: AppState['transaction']['fields']['gasLimit'] = yield select(
    transactionFieldsSelectors.getGasLimit
  );
  const gasPrice: AppState['transaction']['fields']['gasPrice'] = yield select(
    transactionFieldsSelectors.getGasPrice
  );
  const txObj: Partial<ITransaction> = {
    gasLimit: gasLimit.value || undefined,
    gasPrice: gasPrice.value || undefined,
    value
  };

  return yield call(makeTransaction, txObj);
}

//#endregion Validation

//#endregion Sagas
