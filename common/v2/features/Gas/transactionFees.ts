import { ITxFields } from '../SendAssets/types';
import BN from 'bn.js';
import { gasPriceToBase, fromWei } from 'v2/libs/units';

export const calculateWeiTransactionFee = (values: ITxFields): BN => {
  const gasLimitToUse =
    values.isAdvancedTransaction && values.isGasLimitManual
      ? values.gasLimitField
      : values.gasLimitEstimated;
  const gasPriceToUse = values.isAdvancedTransaction ? values.gasPriceField : values.gasPriceSlider;
  const transactionFeeWei: BN = gasPriceToBase(
    parseFloat(gasPriceToUse) * parseFloat(gasLimitToUse)
  );
  return transactionFeeWei;
};

export const calculateStringTransactionFee = (values: ITxFields): string => {
  const weiTxFee = calculateWeiTransactionFee(values);
  return fromWei(weiTxFee, 'ether').toString();
};
