import { IFormikFields } from '../../types';
import isNumber from 'lodash/isNumber';
import { fromWei, totalTxFeeToWei, Wei } from '../../services/EthService/utils';

export abstract class ProtectTransactionUtils {
  public static getProtectTransactionFee(
    sendAssetsValues: IFormikFields,
    rate: number | undefined
  ): { amount: number | null; fee: number | null } {
    if (sendAssetsValues.amount === null || !isNumber(rate)) return { amount: null, fee: null };

    const {
      amount,
      gasLimitField,
      gasEstimates: { safeLow }
    } = sendAssetsValues;

    const gasPrice = sendAssetsValues.advancedTransaction
      ? sendAssetsValues.gasPriceField
      : sendAssetsValues.gasPriceSlider;

    const fixedHalfDollar = 0.5 / rate;

    let fixedFee = 0;
    try {
      fixedFee = parseFloat((parseFloat(amount) * 0.001).toString());
    } catch (e) {
      console.error(e);
    }

    const mainTransactionWei = parseFloat(
      fromWei(Wei(totalTxFeeToWei(gasPrice.toString(), gasLimitField)), 'ether')
    );

    const protectedTransactionWeiMin = Math.min(safeLow, 10);
    const protectedTransactionWei = parseFloat(
      fromWei(Wei(totalTxFeeToWei(protectedTransactionWeiMin.toString(), gasLimitField)), 'ether')
    );

    return {
      amount: fixedHalfDollar + fixedFee - mainTransactionWei,
      fee: protectedTransactionWei
    };
  }
}
