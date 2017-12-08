import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { SetUnitMetaAction, TypeKeys } from 'actions/transaction';
import {
  getUnit,
  getTokenTo,
  getTokenValue,
  getTo,
  getPreviousUnit,
  getValue,
  getGasLimit,
  getGasPrice,
  getDecimalFromUnit
} from 'selectors/transaction';
import { getEtherBalance, getToken, MergedToken, getTokenBalance } from 'selectors/wallet';
import { isEtherUnit, toTokenBase, TokenValue, Wei, Address, fromTokenBase } from 'libs/units';
import {
  swapTokenToEther,
  swapEtherToToken,
  swapTokenToToken
} from 'actions/transaction/actionCreators/swap';
import { getOffline } from 'selectors/config';
import {
  enoughBalanceViaTx,
  encodeTransfer,
  ITransaction,
  enoughTokensViaInput
} from 'libs/transaction';
import { AppState } from 'reducers';
import { makeTransaction } from 'libs/transaction/utils/ether';
import { bufferToHex } from 'ethereumjs-util';

const validNumber = (num: number) => isFinite(num) && num > 0;

interface IInput {
  raw: string;
  value: Wei | TokenValue | null;
}

/**
 * @description Takes in an input, and rebases it to a new decimal, rebases the raw input if it's a valid number. This is used in the process of switching units, as the previous invalid raw input of a user now may become valid depending if the user's balances on the new unit is high enough
 * @param {IInput} value
 * @returns {SagaIterator}
 */
function* rebaseUserInput(value: IInput): SagaIterator {
  const unit: string = yield select(getUnit);
  // get decimal
  const newDecimal: number = yield select(getDecimalFromUnit, unit);

  if (validNumber(+value.raw)) {
    return {
      raw: value.raw,
      value: toTokenBase(value.raw, newDecimal)
    };
  } else {
    const prevUnit: string = yield select(getPreviousUnit);
    const prevDecimal: number = yield select(getDecimalFromUnit, prevUnit);
    return {
      raw: value.raw,
      value: value.value ? toTokenBase(fromTokenBase(value.value, prevDecimal), newDecimal) : null
    };
  }
}

/**
 * @description Creates a minimum viable transaction for calculating costs for validating user balances
 * @param {(Wei | null)} value
 * @returns {SagaIterator}
 */
function* makeCostCalculationTx(
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

export function* validateInput(input: TokenValue | Wei | null, unit: string): SagaIterator {
  if (!input) {
    return false;
  }

  const etherBalance: Wei | null = yield select(getEtherBalance);
  const isOffline: boolean = yield select(getOffline);
  const etherTransaction: boolean = yield call(isEtherUnit, unit);

  if (isOffline || !etherBalance) {
    return true;
  }

  let valid = true;

  // TODO: do gas estimation here if we're switching to a token too, it should cover the last edge case

  //make a new transaction for validating ether balances
  const validationTx = etherTransaction
    ? yield call(makeCostCalculationTx, input)
    : yield call(makeCostCalculationTx, null);

  // check that they have enough ether
  valid = valid && enoughBalanceViaTx(validationTx, etherBalance);

  if (!etherTransaction) {
    const tokenBalance: TokenValue | null = yield select(getTokenBalance, unit);
    valid = valid && enoughTokensViaInput(input, tokenBalance);
  }

  return valid;
}

function* handleSetUnitMeta({ payload: currentUnit }: SetUnitMetaAction) {
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
    yield put(
      swapTokenToEther({ to: tokenTo, value: { raw, value: isValid ? value : null }, decimal })
    );
  }

  if (etherToToken || tokenToToken) {
    const currentToken: MergedToken | undefined = yield select(getToken, currentUnit);
    if (!currentToken) {
      throw Error('Could not find token during unit swap');
    }
    const input: AppState['transaction']['fields']['value'] = yield select(getValue);
    const { raw, value }: IInput = yield call(rebaseUserInput, input);
    const to: AppState['transaction']['fields']['to'] = yield select(getTo);
    const isValid = yield call(validateInput, value, currentUnit);
    const data = encodeTransfer(
      to.value || Address('0x0'),
      isValid ? value || TokenValue('0') : TokenValue('0')
    );
    const basePayload = {
      data: { raw: bufferToHex(data), value: data },
      to: { raw: '', value: Address(currentToken.address) },
      tokenValue: { raw, value: isValid ? value : null },
      decimal
    };
    // need to set meta fields for tokenTo and tokenValue
    if (etherToToken) {
      yield put(
        swapEtherToToken({
          ...basePayload,
          tokenTo: to
        })
      );
    }
    // need to rebase the token if the decimal has changed and re-validate
    if (tokenToToken) {
      yield put(swapTokenToToken(basePayload));
    }
  }
}

export function* setUnitMeta(): SagaIterator {
  takeEvery(TypeKeys.UNIT_META_SET, handleSetUnitMeta);
}
