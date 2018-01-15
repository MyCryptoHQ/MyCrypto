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

  // We do some wallet validation here.
  // For some reason with MetaMask, sometimes the currentValue.value is not a null
  // but instead a BN with a value equal to currentValue.raw - even though the wallet
  // doesn't have enough of a balance.

  // Get the wallet balance (token value or ether value)
  const walletBalance = getCurrentBalance(state);

  // We ensure that we have a valid walletBalance (token or Ether is fine)
  if (!walletBalance) {
    return false;
  }

  if (isEtherTransaction(state)) {
    // if data exists with no value, just check if gas is enough
    if (dataExists && !currentValue.value && currentValue.raw === '') {
      return validGasCost;
    }
    // if the currentValue.value is not null, then compare it against the walletBalance.
    if (currentValue.value) {
      return walletBalance.cmp(currentValue.value) > 0;
    }

    return !!currentValue.value;
  } else {
    // if the currentValue.value is not null, then compare it against the walletBalance.
    if (currentValue.value) {
      return walletBalance.cmp(currentValue.value) > 0;
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
