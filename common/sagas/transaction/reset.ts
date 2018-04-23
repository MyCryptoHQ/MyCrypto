import { SagaIterator } from 'redux-saga';
import { TypeKeys as WalletTypeKeys } from 'actions/wallet';
import { takeEvery, put, take, race, fork, select } from 'redux-saga/effects';
import {
  setUnitMeta,
  TypeKeys as TransactionTypeKeys,
  resetTransactionRequested,
  resetTransactionSuccessful
} from 'actions/transaction';
import { getNetworkUnit } from 'selectors/config';
import { isContractInteraction } from 'selectors/transaction';

export function* resetTransactionState(): SagaIterator {
  const contractInteraction: ReturnType<typeof isContractInteraction> = yield select(
    isContractInteraction
  );
  yield put(resetTransactionSuccessful({ isContractInteraction: contractInteraction }));
}

/**
 * After a transaction is signed, wait for any action that would result in the transaction state changing then fire off
 * a handler that will remove the current serialized transaction so the user does not send a stale transaction
 */
export function* watchTransactionState(): SagaIterator {
  while (true) {
    // wait for transaction to be signed
    yield take([
      TransactionTypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      TransactionTypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ]);

    const { bail } = yield race({
      bail: take([TransactionTypeKeys.RESET_REQUESTED, WalletTypeKeys.WALLET_RESET]), // bail on actions that would wipe state
      wipeState: take([
        TransactionTypeKeys.CURRENT_TO_SET,
        TransactionTypeKeys.CURRENT_VALUE_SET,
        TransactionTypeKeys.GAS_LIMIT_FIELD_SET,
        TransactionTypeKeys.GAS_PRICE_FIELD_SET,
        TransactionTypeKeys.VALUE_FIELD_SET,
        TransactionTypeKeys.DATA_FIELD_SET,
        TransactionTypeKeys.NONCE_FIELD_SET,
        TransactionTypeKeys.TO_FIELD_SET,
        TransactionTypeKeys.TOKEN_TO_META_SET,
        TransactionTypeKeys.TOKEN_VALUE_META_SET,
        TransactionTypeKeys.UNIT_META_SET
      ]) // watch for any actions that would change transaction state
    });

    if (bail) {
      continue;
    }

    yield put(resetTransactionRequested());
  }
}

export function* setNetworkUnit(): SagaIterator {
  const networkUnit = yield select(getNetworkUnit);
  yield put(setUnitMeta(networkUnit));
}

export const reset = [
  takeEvery([WalletTypeKeys.WALLET_RESET], resetTransactionState),
  takeEvery(TransactionTypeKeys.RESET_REQUESTED, resetTransactionState),
  fork(watchTransactionState),
  takeEvery(TransactionTypeKeys.RESET_SUCCESSFUL, setNetworkUnit)
];
