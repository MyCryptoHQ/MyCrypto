import { getTo, getValue } from './fields';
import { getUnit, getTokenTo, getTokenValue } from './meta';
import { AppState } from 'reducers';
import { isEtherUnit, TokenValue, Wei, Address } from 'libs/units';
import { getDataExists } from 'selectors/transaction';
export {
  getCurrentValue,
  getCurrentTo,
  ICurrentValue,
  ICurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidAmount
};

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
  if (!currentTo.value) {
    return false;
  }
  if (isEtherTransaction(state)) {
    return !!currentTo.value || dataExists;
  } else {
    return !!currentTo.value;
  }
};

const isValidAmount = (state: AppState) => {
  const currentValue = getCurrentValue(state);
  const dataExists = getDataExists(state);
  if (isEtherTransaction(state)) {
    return !!currentValue.value || dataExists;
  } else {
    return !!currentValue.value;
  }
};
