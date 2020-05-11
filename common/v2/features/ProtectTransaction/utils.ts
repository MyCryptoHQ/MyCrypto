import BigNumber from 'bignumber.js';
import isNumber from 'lodash/isNumber';
import has from 'lodash/has';
import get from 'lodash/get';
import { fromWei, totalTxFeeToWei, Wei } from '@services/EthService/utils';
import { IFormikFields } from '@types';
import { bigify } from '@utils';
import {
  PROTECTED_TX_FEE_PERCENTAGE,
  PROTECTED_TX_FIXED_FEE_AMOUNT,
  PROTECTED_TX_MIN_AMOUNT
} from '@config';
import { ProtectTxError } from './types';
import { ProtectTxContext } from './ProtectTxProvider';

export abstract class ProtectTxUtils {
  public static getProtectTransactionFee(
    sendAssetsValues: IFormikFields,
    rate: number | undefined
  ): { amount: BigNumber | null; fee: BigNumber | null } {
    if (sendAssetsValues.amount === null || !isNumber(rate)) return { amount: null, fee: null };

    const {
      amount,
      gasLimitField,
      gasEstimates: { safeLow }
    } = sendAssetsValues;

    const gasPrice = sendAssetsValues.advancedTransaction
      ? sendAssetsValues.gasPriceField
      : sendAssetsValues.gasPriceSlider;

    const fixedHalfDollar = PROTECTED_TX_FIXED_FEE_AMOUNT / rate;

    let fixedFee = 0;
    try {
      fixedFee = parseFloat((parseFloat(amount) * PROTECTED_TX_FEE_PERCENTAGE).toString());
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
      amount: bigify((fixedHalfDollar + fixedFee - mainTransactionWei).toString()),
      fee: bigify(protectedTransactionWei.toString())
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

    if (!rate || rate <= 0 || parseFloat(amount) < PROTECTED_TX_MIN_AMOUNT / rate) {
      return ProtectTxError.LESS_THAN_MIN_AMOUNT;
    }

    return ProtectTxError.NO_ERROR;
  }

  public static isProtectTxDefined(protectTxContext: ProtectTxContext): any {
    return (keys: string[] = ['state'], obj: any = protectTxContext): any => {
      if (has(obj, keys)) {
        return get(obj, keys);
      }
      return false;
    };
  }
}
