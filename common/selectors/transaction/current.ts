import { getTo, getValue } from './fields';
import { getUnit, getTokenTo, getTokenValue } from './meta';
import { AppState } from 'reducers';
import { isEtherUnit, TokenValue, Wei, Address } from 'libs/units';
import { getDataExists, getValidGasCost } from 'selectors/transaction';
import { getCurrentBalance } from 'selectors/wallet';

interface ICurrentValue {
  raw: string;
  value: TokenValue | Wei | null;
}

interface ICurrentTo {
  raw: string;
  value: Address | null;
  error?: string | null;
}

const isEtherTransaction = (state: AppState) => {
  const unit = getUnit(state);
  const etherUnit = isEtherUnit(unit);
  return etherUnit;
};

const getCurrentTo = (state: AppState): ICurrentTo =>
  isEtherTransaction(state) ? getTo(state) : getTokenTo(state);

const getCurrentValue = (state: AppState): ICurrentValue =>
  isEtherTransaction(state) ? getValue(state) : getTokenValue(state);

const isValidCurrentTo = (state: AppState) => {
  const currentTo = getCurrentTo(state);
  const dataExists = getDataExists(state);
  if (isEtherTransaction(state)) {
    // if data exists the address can be 0x
    return !!currentTo.value || dataExists;
  } else {
    return !!currentTo.value;
  }
};

const isValidAmount = (state: AppState): boolean => {
  const currentValue = getCurrentValue(state);
  const dataExists = getDataExists(state);
  const validGasCost = getValidGasCost(state);

  // Validation
  const walletBalance = getCurrentBalance(state);

  if (!walletBalance) {
    return false;
  }

  if (isEtherTransaction(state)) {
    // if data exists with no value, just check if gas is enough
    if (dataExists && !currentValue.value && currentValue.raw === '') {
      return validGasCost;
    }
    if (currentValue.value) {
      return walletBalance.cmp(currentValue.value) > 0 ? true : false;
    }

    return !!currentValue.value;
  } else {
    if (currentValue.value) {
      return walletBalance.cmp(currentValue.value) > 0 ? true : false;
    }
    return !!currentValue.value;
  }
};

export {
  getCurrentValue,
  getCurrentTo,
  ICurrentValue,
  ICurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidAmount
};
