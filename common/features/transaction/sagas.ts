import BN from 'bn.js';
import { SagaIterator } from 'redux-saga';
import {
  apply,
  put,
  select,
  take,
  call,
  fork,
  race,
  takeEvery,
  takeLatest,
  all
} from 'redux-saga/effects';

import { Address, toTokenBase, Wei, fromTokenBase, fromWei, TokenValue } from 'libs/units';
import { isValidENSAddress, validNumber, validPositiveNumber, validDecimal } from 'libs/validators';
import { IGetTransaction, ICurrentValue } from 'features/types';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import * as configSelectors from 'features/config/selectors';
import { ensTypes, ensActions, ensSelectors } from 'features/ens';
import { walletTypes, walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { transactionBroadcastSagas } from './broadcast';
import { transactionFieldsTypes, transactionFieldsActions, transactionFieldsSagas } from './fields';
import {
  transactionMetaTypes,
  transactionMetaActions,
  transactionMetaSelectors,
  transactionMetaSagas
} from './meta';
import { transactionNetworkSagas } from './network';
import { transactionSignTypes, transactionSignSagas } from './sign';
import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

//#region Current

//#region Current To
export function* setCurrentToSaga({ payload: raw }: types.SetCurrentToAction): SagaIterator {
  const isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn> = yield select(
    configSelectors.getIsValidAddressFn
  );
  const validAddress: boolean = yield call(isValidAddress, raw);
  const validEns: boolean = yield call(isValidENSAddress, raw);

  let value: Buffer | null = null;
  if (validAddress) {
    value = Address(raw);
  } else if (validEns) {
    yield call(setField, { value, raw });

    yield put(ensActions.resolveDomainRequested(raw));
    yield take([
      ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED
    ]);
    const resolvedAddress: string | null = yield select(ensSelectors.getResolvedAddress, true);
    if (resolvedAddress) {
      value = Address(resolvedAddress);
    }
  }

  yield call(setField, { value, raw });
}

export function* setField(
  payload:
    | transactionFieldsTypes.SetToFieldAction['payload']
    | transactionMetaTypes.SetTokenToMetaAction['payload']
) {
  const etherTransaction: boolean = yield select(derivedSelectors.isEtherTransaction);

  if (etherTransaction) {
    yield put(transactionFieldsActions.setToField(payload));
  } else {
    yield put(transactionMetaActions.setTokenTo(payload));
  }
}

export const currentTo = takeLatest([types.TransactionActions.CURRENT_TO_SET], setCurrentToSaga);
//#endregion Current To

//#region Current Value
export function* setCurrentValueSaga(action: types.SetCurrentValueAction): SagaIterator {
  const etherTransaction = yield select(derivedSelectors.isEtherTransaction);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;
  return yield call(valueHandler, action, setter);
}

export function* valueHandler(
  { payload }: types.SetCurrentValueAction,
  setter: transactionFieldsActions.TSetValueField | transactionMetaActions.TSetTokenValue
) {
  const decimal: number = yield select(transactionMetaSelectors.getDecimal);
  const unit: string = yield select(derivedSelectors.getUnit);
  const isEth = yield select(derivedSelectors.isEtherTransaction);
  const validNum = isEth ? validNumber : validPositiveNumber;

  if (!validNum(Number(payload)) || !validDecimal(payload, decimal)) {
    return yield put(setter({ raw: payload, value: null }));
  }
  const value = toTokenBase(payload, decimal);
  const isValid: boolean = yield call(helpers.validateInput, value, unit);

  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export function* revalidateCurrentValue(): SagaIterator {
  const etherTransaction = yield select(derivedSelectors.isEtherTransaction);
  const currVal: ICurrentValue = yield select(derivedSelectors.getCurrentValue);
  const reparsedValue: null | ICurrentValue = yield call(reparseCurrentValue, currVal);
  const unit: string = yield select(derivedSelectors.getUnit);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;
  if (!reparsedValue || !reparsedValue.value) {
    return yield put(setter({ raw: currVal.raw, value: null }));
  }
  const isValid: boolean = yield call(helpers.validateInput, reparsedValue.value, unit);
  const newVal = { raw: reparsedValue.raw, value: isValid ? reparsedValue.value : null };

  if (isValueDifferent(currVal, newVal)) {
    yield put(setter(newVal));
  }
}

export function isValueDifferent(curVal: ICurrentValue, newVal: ICurrentValue) {
  const val1 = curVal.value as BN;
  const val2 = newVal.value as BN;

  if (curVal.raw !== newVal.raw) {
    return true;
  }
  if (BN.isBN(val1) && BN.isBN(val2)) {
    return !val1.eq(val2);
  }
  if (curVal.value !== newVal.value) {
    return true;
  }
}

export function* reparseCurrentValue(value: helpers.IInput): SagaIterator {
  const isEth = yield select(derivedSelectors.isEtherTransaction);
  const decimal = yield select(transactionMetaSelectors.getDecimal);
  const validNum = isEth ? validNumber : validPositiveNumber;

  if (validNum(Number(value.raw)) && validDecimal(value.raw, decimal)) {
    return {
      raw: value.raw,
      value: toTokenBase(value.raw, decimal)
    };
  } else {
    return null;
  }
}

export const currentValue = [
  takeEvery([types.TransactionActions.CURRENT_VALUE_SET], setCurrentValueSaga),
  takeEvery(
    [
      transactionFieldsTypes.TransactionFieldsActions.GAS_LIMIT_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_FIELD_SET
    ],
    revalidateCurrentValue
  )
];
//#endregion Current Value

export const current = [currentTo, ...currentValue];
//#endregion Current

//#region Send Everything
export function* handleSendEverything(): SagaIterator {
  const { transaction }: IGetTransaction = yield select(derivedSelectors.getTransaction);
  const currentBalance: Wei | TokenValue | null = yield select(derivedSelectors.getCurrentBalance);
  const etherBalance: AppState['wallet']['balance']['wei'] = yield select(
    walletSelectors.getEtherBalance
  );
  if (!etherBalance || !currentBalance) {
    return yield put(actions.sendEverythingFailed());
  }
  transaction.value = Buffer.from([]);

  const etherTransaction: boolean = yield select(derivedSelectors.isEtherTransaction);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;

  // set transaction value to 0 so it's not calculated in the upfrontcost

  const totalCost: Wei = yield apply(transaction, transaction.getUpfrontCost);
  if (totalCost.gt(etherBalance)) {
    // Dust amount is too small
    yield put(
      notificationsActions.showNotification(
        'warning',
        `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
      )
    );
    yield put(actions.sendEverythingFailed());

    return yield put(setter({ raw: '0', value: null }));
  }
  if (etherTransaction) {
    const remainder = currentBalance.sub(totalCost);
    const rawVersion = fromWei(remainder, 'ether');
    yield put(setter({ raw: rawVersion, value: remainder }));

    yield put(actions.sendEverythingSucceeded());
  } else {
    // else we just max out the token value
    const decimal: number = yield select(transactionMetaSelectors.getDecimal);
    const rawVersion = fromTokenBase(currentBalance, decimal);
    yield put(setter({ raw: rawVersion, value: currentBalance }));

    yield put(actions.sendEverythingSucceeded());
  }
}

export const sendEverything = [
  takeEvery(types.TransactionActions.SEND_EVERYTHING_REQUESTED, handleSendEverything)
];

//#endregion Send Everything

//#region Reset
export function* resetTransactionState(): SagaIterator {
  const contractInteraction: ReturnType<
    typeof transactionMetaSelectors.isContractInteraction
  > = yield select(transactionMetaSelectors.isContractInteraction);
  yield put(
    transactionFieldsActions.resetTransactionSuccessful({
      isContractInteraction: contractInteraction
    })
  );
}

/**
 * After a transaction is signed, wait for any action that would result in the transaction state changing then fire off
 * a handler that will remove the current serialized transaction so the user does not send a stale transaction
 */
export function* watchTransactionState(): SagaIterator {
  while (true) {
    // wait for transaction to be signed
    yield take([
      transactionSignTypes.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      transactionSignTypes.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ]);

    const { bail } = yield race({
      bail: take([types.TransactionActions.RESET_REQUESTED, walletTypes.WalletActions.RESET]), // bail on actions that would wipe state
      wipeState: take([
        types.TransactionActions.CURRENT_TO_SET,
        types.TransactionActions.CURRENT_VALUE_SET,
        transactionFieldsTypes.TransactionFieldsActions.GAS_LIMIT_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.NONCE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
        transactionMetaTypes.TransactionMetaActions.TOKEN_TO_META_SET,
        transactionMetaTypes.TransactionMetaActions.TOKEN_VALUE_META_SET,
        transactionMetaTypes.TransactionMetaActions.UNIT_META_SET
      ]) // watch for any actions that would change transaction state
    });

    if (bail) {
      continue;
    }

    yield put(transactionFieldsActions.resetTransactionRequested());
  }
}

export function* setNetworkUnit(): SagaIterator {
  const networkUnit = yield select(configSelectors.getNetworkUnit);
  yield put(transactionMetaActions.setUnitMeta(networkUnit));
}

export const reset = [
  takeEvery([walletTypes.WalletActions.RESET], resetTransactionState),
  takeEvery(types.TransactionActions.RESET_REQUESTED, resetTransactionState),
  fork(watchTransactionState),
  takeEvery(types.TransactionActions.RESET_SUCCESSFUL, setNetworkUnit)
];

//#endregion Reset

export function* transactionSaga(): SagaIterator {
  yield all([
    ...transactionBroadcastSagas.broadcastSaga,
    ...transactionFieldsSagas.fieldsSaga,
    ...transactionMetaSagas.metaSaga,
    ...transactionNetworkSagas.networkSaga,
    ...transactionSignSagas.signing,
    ...current,
    ...sendEverything,
    ...reset
  ]);
}
