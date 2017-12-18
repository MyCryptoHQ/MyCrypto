import { TokenValue, Wei, isEtherUnit, toTokenBase } from 'libs/units';
import { SagaIterator } from 'redux-saga';
import { getEtherBalance, getTokenBalance } from 'selectors/wallet';
import { getOffline } from 'selectors/config';
import { select, call } from 'redux-saga/effects';
import { AppState } from 'reducers';
import { getGasLimit, getGasPrice, getUnit, getDecimalFromUnit } from 'selectors/transaction';
import {
  ITransaction,
  enoughBalanceViaTx,
  enoughTokensViaInput,
  makeTransaction
} from 'libs/transaction';
import { validNumber, validDecimal } from 'libs/validators';

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

  if (validNumber(+value.raw) && validDecimal(value.raw, newDecimal)) {
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

  // check that they have enough ether, this checks gas cost too
  valid = valid && enoughBalanceViaTx(validationTx, etherBalance);

  if (!etherTransaction) {
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
