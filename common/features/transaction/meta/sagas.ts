import { SagaIterator } from 'redux-saga';
import { put, select, call, takeEvery } from 'redux-saga/effects';
import { bufferToHex } from 'ethereumjs-util';

import { encodeTransfer } from 'libs/transaction';
import { Address, TokenValue } from 'libs/units';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import * as configSelectors from 'features/config/selectors';
import { walletTypes } from 'features/wallet';
import { transactionFieldsActions, transactionFieldsSelectors } from '../fields';
import * as transactionActions from '../actions';
import * as transactionSelectors from '../selectors';
import * as helpers from '../helpers';
import * as types from './types';
import * as selectors from './selectors';

//#region Token
export function* handleTokenTo({ payload }: types.SetTokenToMetaAction): SagaIterator {
  const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(
    selectors.getTokenValue
  );
  if (!(tokenValue.value && payload.value)) {
    return;
  }

  // encode token data and dispatch it
  const data = yield call(encodeTransfer, payload.value, tokenValue.value);
  yield put(transactionFieldsActions.setDataField({ raw: bufferToHex(data), value: data }));
}

export function* handleTokenValue({ payload }: types.SetTokenValueMetaAction) {
  const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(selectors.getTokenTo);
  const prevData = yield select(transactionFieldsSelectors.getData);
  if (!(tokenTo.value && payload.value)) {
    return;
  }
  const data = yield call(encodeTransfer, tokenTo.value, payload.value);
  if (prevData.raw === bufferToHex(data)) {
    return;
  }
  yield put(transactionFieldsActions.setDataField({ raw: bufferToHex(data), value: data }));
}

export const handleToken = [
  takeEvery(types.TransactionMetaActions.TOKEN_TO_META_SET, handleTokenTo),
  takeEvery(types.TransactionMetaActions.TOKEN_VALUE_META_SET, handleTokenValue)
];
//#endregion Token

//#region Set Unit
export function* handleSetUnitMeta({
  payload: currentUnit
}: types.SetUnitMetaAction): SagaIterator {
  const previousUnit: string = yield select(transactionSelectors.getPreviousUnit);
  const prevUnit = yield select(configSelectors.isNetworkUnit, previousUnit);
  const currUnit = yield select(configSelectors.isNetworkUnit, currentUnit);
  const etherToEther = currUnit && prevUnit;
  const etherToToken = !currUnit && prevUnit;
  const tokenToEther = currUnit && !prevUnit;
  const tokenToToken = !currUnit && !prevUnit;
  const decimal: number = yield select(derivedSelectors.getDecimalFromUnit, currentUnit);

  if (etherToEther || previousUnit === '') {
    return;
  }

  if (tokenToEther) {
    const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(selectors.getTokenTo);
    const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(
      selectors.getTokenValue
    );

    //set the 'to' field from what the token 'to' field was
    // if switching to ether, clear token data and value
    const { value, raw }: helpers.IInput = yield call(helpers.rebaseUserInput, tokenValue);

    const isValid = yield call(helpers.validateInput, value, currentUnit);
    return yield put(
      transactionActions.swapTokenToEther({
        to: tokenTo,
        value: { raw, value: isValid ? value : null },
        decimal
      })
    );
  }

  if (etherToToken || tokenToToken) {
    const currentToken: walletTypes.MergedToken | undefined = yield select(
      derivedSelectors.getToken,
      currentUnit
    );
    if (!currentToken) {
      throw Error('Could not find token during unit swap');
    }
    const input:
      | AppState['transaction']['fields']['value']
      | AppState['transaction']['meta']['tokenValue'] = etherToToken
      ? yield select(transactionFieldsSelectors.getValue)
      : yield select(selectors.getTokenValue);
    const { raw, value }: helpers.IInput = yield call(helpers.rebaseUserInput, input);

    const isValid = yield call(helpers.validateInput, value, currentUnit);
    const to: AppState['transaction']['fields']['to'] = yield select(
      transactionFieldsSelectors.getTo
    );

    const valueToEncode = isValid && value ? value : TokenValue('0');
    let addressToEncode;
    if (etherToToken) {
      addressToEncode = to.value || Address('0x0');
    } else {
      const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(
        selectors.getTokenTo
      );
      addressToEncode = tokenTo.value || Address('0x0');
    }

    const data = encodeTransfer(addressToEncode, valueToEncode);

    const basePayload = {
      data: { raw: bufferToHex(data), value: data },
      to: { raw: '', value: Address(currentToken.address) },
      tokenValue: { raw, value: isValid ? value : null },
      decimal
    };
    // need to set meta fields for tokenTo and tokenValue
    if (etherToToken) {
      return yield put(
        transactionActions.swapEtherToToken({
          ...basePayload,
          tokenTo: to
        })
      );
    }
    // need to rebase the token if the decimal has changed and re-validate
    if (tokenToToken) {
      return yield put(transactionActions.swapTokenToToken(basePayload));
    }
  }
}

export const handleSetUnit = [
  takeEvery(types.TransactionMetaActions.UNIT_META_SET, handleSetUnitMeta)
];
//#endregion Set Unit

export const metaSaga = [...handleToken, ...handleSetUnit];
