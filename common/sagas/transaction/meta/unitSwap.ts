import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { SetUnitMetaAction, TypeKeys } from 'actions/transaction';
import {
  getTokenTo,
  getTokenValue,
  getTo,
  getPreviousUnit,
  getValue,
  getDecimalFromUnit
} from 'selectors/transaction';
import { getToken, MergedToken } from 'selectors/wallet';
import { isEtherUnit, TokenValue, Address } from 'libs/units';
import {
  swapTokenToEther,
  swapEtherToToken,
  swapTokenToToken
} from 'actions/transaction/actionCreators/swap';
import { encodeTransfer } from 'libs/transaction';
import { AppState } from 'reducers';
import { bufferToHex } from 'ethereumjs-util';
import { validateInput, rebaseUserInput, IInput } from 'sagas/transaction/validationHelpers';

export function* handleSetUnitMeta({ payload: currentUnit }: SetUnitMetaAction): SagaIterator {
  const previousUnit: string = yield select(getPreviousUnit);
  const etherToEther = isEtherUnit(currentUnit) && isEtherUnit(previousUnit);
  const etherToToken = !isEtherUnit(currentUnit) && isEtherUnit(previousUnit);
  const tokenToEther = isEtherUnit(currentUnit) && !isEtherUnit(previousUnit);
  const tokenToToken = !isEtherUnit(currentUnit) && !isEtherUnit(previousUnit);
  const decimal: number = yield select(getDecimalFromUnit, currentUnit);

  if (etherToEther) {
    return;
  }

  if (tokenToEther) {
    const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
    const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(getTokenValue);

    //set the 'to' field from what the token 'to' field was
    // if switching to ether, clear token data and value
    const { value, raw }: IInput = yield call(rebaseUserInput, tokenValue);

    const isValid = yield call(validateInput, value, currentUnit);
    return yield put(
      swapTokenToEther({ to: tokenTo, value: { raw, value: isValid ? value : null }, decimal })
    );
  }

  if (etherToToken || tokenToToken) {
    const currentToken: MergedToken | undefined = yield select(getToken, currentUnit);
    if (!currentToken) {
      throw Error('Could not find token during unit swap');
    }
    const input:
      | AppState['transaction']['fields']['value']
      | AppState['transaction']['meta']['tokenValue'] = etherToToken
      ? yield select(getValue)
      : yield select(getTokenValue);
    const { raw, value }: IInput = yield call(rebaseUserInput, input);

    const isValid = yield call(validateInput, value, currentUnit);
    const to: AppState['transaction']['fields']['to'] = yield select(getTo);

    const valueToEncode = isValid && value ? value : TokenValue('0');
    let addressToEncode;
    if (etherToToken) {
      addressToEncode = to.value || Address('0x0');
    } else {
      const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
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
        swapEtherToToken({
          ...basePayload,
          tokenTo: to
        })
      );
    }
    // need to rebase the token if the decimal has changed and re-validate
    if (tokenToToken) {
      return yield put(swapTokenToToken(basePayload));
    }
  }
}

export const handleSetUnit = [takeEvery(TypeKeys.UNIT_META_SET, handleSetUnitMeta)];
