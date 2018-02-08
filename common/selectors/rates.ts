import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { getUnit, isEtherTransaction, getParamsFromSerializedTx } from 'selectors/transaction';
import BN from 'bn.js';
import { Wei, TokenValue } from 'libs/units';

export const getRates = (state: AppState) => state.rates;

const getUSDConversionRate = (state: AppState, unit: string) => {
  const { isTestnet } = getNetworkConfig(state);
  const { rates } = getRates(state);
  const isEther = isEtherTransaction(state);
  const conversionUnit = isEther ? 'ETH' : unit;
  if (isTestnet) {
    return null;
  }

  const conversionRate = rates[conversionUnit];

  if (!conversionRate) {
    return null;
  }
  return conversionRate.USD;
};

export const getValueInUSD = (state: AppState, value: TokenValue | Wei) => {
  const unit = getUnit(state);
  const conversionRate = getUSDConversionRate(state, unit);
  if (!conversionRate) {
    return null;
  }

  const sendValueUSD = value.muln(conversionRate);
  return sendValueUSD;
};
export const getTransactionFeeInUSD = (state: AppState, fee: Wei) => {
  const { unit } = getNetworkConfig(state);
  const conversionRate = getUSDConversionRate(state, unit);

  if (!conversionRate) {
    return null;
  }

  const feeValueUSD = fee.muln(conversionRate);
  return feeValueUSD;
};

export interface AllUSDValues {
  valueUSD: BN | null;
  feeUSD: BN | null;
  totalUSD: BN | null;
}

export const getAllUSDValuesFromSerializedTx = (state: AppState): AllUSDValues => {
  const fields = getParamsFromSerializedTx(state);
  if (!fields) {
    return {
      feeUSD: null,
      valueUSD: null,
      totalUSD: null
    };
  }
  const { currentValue, fee } = fields;
  const valueUSD = getValueInUSD(state, currentValue);
  const feeUSD = getTransactionFeeInUSD(state, fee);
  return {
    feeUSD,
    valueUSD,
    totalUSD: feeUSD && valueUSD ? valueUSD.add(feeUSD) : null
  };
};
