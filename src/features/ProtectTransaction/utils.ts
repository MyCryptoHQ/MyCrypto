import BigNumber from 'bignumber.js';
import moment from 'moment';
import isNumber from 'lodash/isNumber';

import { fromWei, totalTxFeeToWei, Wei } from '@services/EthService/utils';
import {
  GetTokenTxResponse,
  GetTxResponse,
  GetBalanceResponse
} from '@services/ApiService/Etherscan/types';
import { IFormikFields, TAddress } from '@types';
import { bigify, isSameAddress } from '@utils';
import {
  PROTECTED_TX_FEE_PERCENTAGE,
  PROTECTED_TX_FIXED_FEE_AMOUNT,
  PROTECTED_TX_MIN_AMOUNT
} from '@config';

import { ProtectTxError, NansenReportType } from './types';
import { MALICIOUS_LABELS, WHITELISTED_LABELS } from './constants';

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
    const { asset, amount, address } = formValues;

    if (!asset || !amount || !address) return ProtectTxError.INSUFFICIENT_DATA;

    if (asset.ticker !== 'ETH') {
      return ProtectTxError.ETH_ONLY;
    }

    if (!rate || rate <= 0 || parseFloat(amount) < PROTECTED_TX_MIN_AMOUNT / rate) {
      return ProtectTxError.LESS_THAN_MIN_AMOUNT;
    }

    return ProtectTxError.NO_ERROR;
  }

  public static getNansenReportType(labels: string[]): NansenReportType {
    if (MALICIOUS_LABELS.some((l) => labels.includes(l))) {
      return NansenReportType.MALICIOUS;
    } else if (WHITELISTED_LABELS.some((l) => labels.includes(l))) {
      return NansenReportType.WHITELISTED;
    }
    return NansenReportType.UNKNOWN;
  }

  public static getLastTx(
    etherscanLastTxReport: GetTxResponse | null,
    etherscanLastTokenTxReport: GetTokenTxResponse | null,
    receiverAddress: string | null
  ) {
    const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YYYY');

    if (
      etherscanLastTxReport &&
      etherscanLastTxReport.result.length >= 0 &&
      etherscanLastTokenTxReport &&
      etherscanLastTokenTxReport.result.length >= 0
    ) {
      const { result: txResult } = etherscanLastTxReport;
      const { result: tokenResult } = etherscanLastTokenTxReport;
      const firstSentTx = txResult.find((r) =>
        receiverAddress ? isSameAddress(r.from as TAddress, receiverAddress as TAddress) : false
      );
      const firstSentToken = tokenResult.find((r) =>
        receiverAddress ? isSameAddress(r.from as TAddress, receiverAddress as TAddress) : false
      );
      if (firstSentToken || firstSentTx) {
        const firstSentResult =
          parseInt(firstSentTx?.timeStamp || '0', 10) >
          parseInt(firstSentToken?.timeStamp || '0', 10)
            ? { ...firstSentTx!, tokenSymbol: 'ETH' }
            : firstSentToken!;
        const { tokenSymbol: ticker, value, timeStamp } = firstSentResult;
        return {
          ticker,
          value: parseFloat(fromWei(Wei(value), 'ether')).toFixed(6),
          timestamp: formatDate(parseInt(timeStamp, 10))
        };
      }
    }
    return null;
  }

  public static getBalance(balanceReport: GetBalanceResponse | null) {
    if (balanceReport) {
      const { result } = balanceReport;
      return parseFloat(fromWei(Wei(result), 'ether')).toFixed(6);
    }
    return null;
  }
}
