import { getTo, getValue } from './fields';
import { getUnit, getTokenTo, getTokenValue } from './meta';
import { AppState } from 'reducers';
import { isEtherUnit, TokenValue, Wei, Address } from 'libs/units';
import { getDataExists, getValidGasCost } from 'selectors/transaction';

interface ICurrentValue {
  raw: string;
  value: TokenValue | Wei | null;
}

interface ICurrentTo {
  raw: string;
  value: Address | null;
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

const isValidAmount = (state: AppState) => {
  const currentValue = getCurrentValue(state);
  const dataExists = getDataExists(state);
  const validGasCost = getValidGasCost(state);
  if (isEtherTransaction(state)) {
    // if data exists with no value, just check if gas is enough
    if (dataExists && !currentValue.value && currentValue.raw === '') {
      return validGasCost;
    }

    return !!currentValue.value;
  } else {
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
