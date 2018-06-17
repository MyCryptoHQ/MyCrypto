import Tx from 'ethereumjs-tx';
import { SagaIterator } from 'redux-saga';
import { select, call, put, take } from 'redux-saga/effects';

import { TokenValue, Wei, toTokenBase } from 'libs/units';
import { IFullWallet } from 'libs/wallet';
import {
  ITransaction,
  enoughBalanceViaTx,
  enoughTokensViaInput,
  makeTransaction
} from 'libs/transaction';
import { validNumber, validDecimal } from 'libs/validators';
import { StaticNetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { getOffline } from 'features/config/meta/selectors';
import { isNetworkUnit, getNetworkConfig } from 'features/config/selectors';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsSelectors } from './fields';
import { transactionNetworkTypes, transactionNetworkActions } from './network';
import { transactionSignTypes, transactionSignActions } from './sign';
//#region Sagas

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
