import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';

import { TokenValue, Wei, toTokenBase } from 'libs/units';
import {
  ITransaction,
  enoughBalanceViaTx,
  enoughTokensViaInput,
  makeTransaction
} from 'libs/transaction';
import { validNumber, validDecimal } from 'libs/validators';

import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configSelectors from 'features/config/selectors';
import { walletSelectors } from 'features/wallet';
import { transactionFieldsSelectors } from './fields';

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
  const unit: string = yield select(derivedSelectors.getUnit);
  // get decimal
  const newDecimal: number = yield select(derivedSelectors.getDecimalFromUnit, unit);

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
  const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  const networkUnitTransaction: boolean = yield select(configSelectors.isNetworkUnit, unit);

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
    const tokenBalance: TokenValue | null = yield select(derivedSelectors.getTokenBalance, unit);
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
