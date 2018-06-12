import React from 'react';
import Tx from 'ethereumjs-tx';
import { SagaIterator } from 'redux-saga';
import { select, call, put, take } from 'redux-saga/effects';
import { bufferToHex } from 'ethereumjs-util';

import { NetworkConfig, StaticNetworkConfig } from 'types/network';
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
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { AppState } from 'features/reducers';
import { getOffline, isNetworkUnit, getNetworkConfig } from 'features/config';
import { isSchedulingEnabled } from 'features/schedule';
import { getWalletInst, getEtherBalance, getTokenBalance } from 'features/wallet';
import { showNotification } from 'features/notifications';
import { StateSerializedTx } from './sign/reducer';
import { TRANSACTION } from './types';
import {
  TRANSACTION_BROADCAST,
  BroadcastRequestedAction,
  ISerializedTxAndIndexingHash,
  ITransactionStatus
} from './broadcast/types';
import { GetFromFailedAction, GetFromSucceededAction } from './network/types';
import { SignTransactionRequestedAction } from './sign/types';
import { resetTransactionRequested } from './fields/actions';
import {
  broadcastTransactionFailed,
  broadcastTransactionSucceeded,
  broadcastTransactionQueued
} from './broadcast/actions';
import { getFromRequested } from './network/actions';
import { signTransactionFailed } from './sign/actions';
import { ICurrentTo, ICurrentValue, getUnit, getDecimalFromUnit } from './selectors';
import { getTransactionStatus } from './broadcast/selectors';
import { getGasLimit, getGasPrice } from './fields/selectors';
import { getWeb3Tx, getSignedTx } from './sign/selectors';

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
  currentTo: ICurrentTo,
  currentValue: ICurrentValue,
  dataExists: boolean,
  validGasCost: boolean,
  unit: string // if its ether, we can have empty data, if its a token, we cant have value
) => {
  const { data, value, to, ...rest } = transactionFields;
  const partialParamsToCheck = { ...rest };

  const validPartialParams = Object.values(partialParamsToCheck).reduce<boolean>(
    (isValid, v: AppState['transaction']['fields'] & ICurrentTo & ICurrentValue) =>
      isValid && !!v.value,
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
  function* handleBroadcastTransaction(action: BroadcastRequestedAction) {
    const { indexingHash, serializedTransaction }: ISerializedTxAndIndexingHash = yield call(
      getSerializedTxAndIndexingHash,
      action
    );

    try {
      const shouldBroadcast: boolean = yield call(shouldBroadcastTransaction, indexingHash);
      if (!shouldBroadcast) {
        yield put(
          showNotification(
            'warning',
            'TxHash identical: This transaction has already been broadcasted or is broadcasting'
          )
        );
        yield put(resetTransactionRequested());
        return;
      }
      const queueAction = broadcastTransactionQueued({
        indexingHash,
        serializedTransaction
      });
      yield put(queueAction);
      const stringTx: string = yield call(bufferToHex, serializedTransaction);
      const broadcastedHash: string = yield call(func, stringTx); // convert to string because node / web3 doesnt support buffers
      yield put(broadcastTransactionSucceeded({ indexingHash, broadcastedHash }));

      const network: NetworkConfig = yield select(getNetworkConfig);

      const scheduling: boolean = yield select(isSchedulingEnabled);
      yield put(
        showNotification(
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
      yield put(broadcastTransactionFailed({ indexingHash }));
      yield put(showNotification('danger', (error as Error).message));
    }
  };

export function* shouldBroadcastTransaction(indexingHash: string): SagaIterator {
  const existingTx: ITransactionStatus | null = yield select(getTransactionStatus, indexingHash);
  // if the transaction already exists
  if (existingTx) {
    // and is still broadcasting or already broadcasting, dont re-broadcast
    if (existingTx.isBroadcasting || existingTx.broadcastSuccessful) {
      return false;
    }
  }
  return true;
}
export function* getSerializedTxAndIndexingHash({ type }: BroadcastRequestedAction): SagaIterator {
  const isWeb3Req = type === TRANSACTION_BROADCAST.WEB3_TRANSACTION_REQUESTED;
  const txSelector = isWeb3Req ? getWeb3Tx : getSignedTx;
  const serializedTransaction: StateSerializedTx = yield select(txSelector);

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
  function*(partialTx: SignTransactionRequestedAction) {
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
  partialTx: SignTransactionRequestedAction['payload']
): SagaIterator {
  // get the wallet we're going to sign with
  const wallet: null | IFullWallet = yield select(getWalletInst);
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
  yield put(showNotification('danger', err.message, 5000));
  yield put(signTransactionFailed());
}

export function* getFromSaga(): SagaIterator {
  yield put(getFromRequested());
  // wait for it to finish
  const { type }: GetFromFailedAction | GetFromSucceededAction = yield take([
    TRANSACTION.GET_FROM_SUCCEEDED,
    TRANSACTION.GET_FROM_FAILED
  ]);
  // continue if it doesnt fail
  if (type === TRANSACTION.GET_FROM_FAILED) {
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
  const unit: string = yield select(getUnit);
  // get decimal
  const newDecimal: number = yield select(getDecimalFromUnit, unit);

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

  const etherBalance: Wei | null = yield select(getEtherBalance);
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
    const tokenBalance: TokenValue | null = yield select(getTokenBalance, unit);
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
  const gasLimit: AppState['transaction']['fields']['gasLimit'] = yield select(getGasLimit);
  const gasPrice: AppState['transaction']['fields']['gasPrice'] = yield select(getGasPrice);
  const txObj: Partial<ITransaction> = {
    gasLimit: gasLimit.value || undefined,
    gasPrice: gasPrice.value || undefined,
    value
  };

  return yield call(makeTransaction, txObj);
}

//#endregion Validation

//#endregion Sagas
