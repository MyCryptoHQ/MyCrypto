import { getTo, getValue } from './fields';
import { getUnit, getTokenTo, getTokenValue } from './meta';
import { AppState } from 'reducers';
import { TokenValue, Wei, Address } from 'libs/units';
import { gasPriceValidator, gasLimitValidator } from 'libs/validators';
import { getDataExists, getGasPrice, getGasLimit } from 'selectors/transaction';
import { isNetworkUnit } from 'selectors/config';
import { getAddressMessage, AddressMessage } from 'config';

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
  const etherUnit = isNetworkUnit(state, unit);
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

const isValidGasPrice = (state: AppState): boolean => gasPriceValidator(getGasPrice(state).raw);

const isValidGasLimit = (state: AppState): boolean => gasLimitValidator(getGasLimit(state).raw);

function getCurrentToAddressMessage(state: AppState): AddressMessage | undefined {
  const to = getCurrentTo(state);
  return getAddressMessage(to.raw);
}

export {
  getCurrentValue,
  getCurrentTo,
  ICurrentValue,
  ICurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidGasPrice,
  isValidGasLimit,
  getCurrentToAddressMessage
};
