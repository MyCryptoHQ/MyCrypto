import isNumber from 'lodash/isNumber';
import { fromWei, totalTxFeeToWei, Wei } from 'v2/services/EthService/utils';
import { IFormikFields } from 'v2/types';
import { ProtectTxError } from './types';

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

  public static checkFormForProtectedTxErrors(
    formValues: IFormikFields,
    rate: number | undefined
  ): ProtectTxError {
    const { asset, amount } = formValues;

    if (!asset || !amount) return ProtectTxError.INSUFFICIENT_DATA;

    if (asset.ticker !== 'ETH') {
      return ProtectTxError.ETH_ONLY;
    }

    if (!rate || rate <= 0 || parseFloat(amount) < 0.5 / rate) {
      return ProtectTxError.LESS_THAN_MIN_AMOUNT;
    }

    return ProtectTxError.NO_ERROR;
  }
}
