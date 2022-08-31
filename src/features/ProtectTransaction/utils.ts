import BigNumber from 'bignumber.js';
import isNumber from 'lodash/isNumber';

import {
  PROTECTED_TX_FEE_PERCENTAGE,
  PROTECTED_TX_FIXED_FEE_AMOUNT,
  PROTECTED_TX_MIN_AMOUNT
} from '@config';
import {
  GetBalanceResponse,
  GetTokenTxResponse,
  GetTxResponse
} from '@services/ApiService/Etherscan/types';
import { IFormikFields, TAddress } from '@types';
import {
  bigify,
  formatDate,
  fromWei,
  gasStringsToMaxGasNumber,
  isSameAddress,
  totalTxFeeToWei,
  Wei
} from '@utils';

import { MALICIOUS_LABELS, WHITELISTED_LABELS } from './constants';
import { NansenReportType, ProtectTxError } from './types';

export const getProtectTxFee = (
  sendAssetsValues: Pick<
    IFormikFields,
    'amount' | 'gasLimitField' | 'advancedTransaction' | 'gasPriceField' | 'gasPriceSlider'
  >,
  rate: number | undefined
): { amount: BigNumber | null; fee: BigNumber | null } => {
  if (sendAssetsValues.amount === null || !isNumber(rate)) return { amount: null, fee: null };

  const { amount, gasLimitField } = sendAssetsValues;

  const gasPrice = sendAssetsValues.advancedTransaction
    ? sendAssetsValues.gasPriceField
    : sendAssetsValues.gasPriceSlider;

  const fixedHalfDollar = bigify(PROTECTED_TX_FIXED_FEE_AMOUNT).dividedBy(rate);

  let fixedFee = bigify(0);
  try {
    fixedFee = bigify(amount).multipliedBy(PROTECTED_TX_FEE_PERCENTAGE);
  } catch (e) {
    console.error(e);
  }

  const mainTransactionWei = bigify(
    fromWei(Wei(totalTxFeeToWei(gasPrice, gasLimitField)), 'ether')
  );

  const protectedTransactionWei = gasStringsToMaxGasNumber(gasPrice, gasLimitField);

  return {
    amount: fixedHalfDollar.plus(fixedFee).minus(mainTransactionWei),
    fee: protectedTransactionWei
  };
};

export const checkFormForProtectTxErrors = (
  formValues: IFormikFields,
  rate: number | undefined,
  isPTXFree: boolean
): ProtectTxError => {
  const { asset, amount, address } = formValues;

  if (!asset || !amount || !address) return ProtectTxError.INSUFFICIENT_DATA;

  if (asset.ticker !== 'ETH') {
    return ProtectTxError.ETH_ONLY;
  }

  if (
    !isPTXFree &&
    (!rate || rate <= 0 || bigify(amount).lt(bigify(PROTECTED_TX_MIN_AMOUNT).dividedBy(rate)))
  ) {
    return ProtectTxError.LESS_THAN_MIN_AMOUNT;
  }

  return ProtectTxError.NO_ERROR;
};

export const getNansenReportType = (labels: string[]): NansenReportType => {
  if (MALICIOUS_LABELS.some((l) => labels.includes(l))) {
    return NansenReportType.MALICIOUS;
  } else if (WHITELISTED_LABELS.some((l) => labels.includes(l))) {
    return NansenReportType.WHITELISTED;
  }
  return NansenReportType.UNKNOWN;
};

export const getLastTx = (
  etherscanLastTxReport: GetTxResponse | null,
  etherscanLastTokenTxReport: GetTokenTxResponse | null,
  receiverAddress: string | null
) => {
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
        parseInt(firstSentTx?.timeStamp || '0', 10) > parseInt(firstSentToken?.timeStamp || '0', 10)
          ? { ...firstSentTx!, tokenSymbol: 'ETH' }
          : firstSentToken!;
      const { tokenSymbol: ticker, value, timeStamp } = firstSentResult;
      return {
        ticker,
        value: bigify(fromWei(Wei(value), 'ether')).toFixed(6),
        timestamp: formatDate(parseInt(timeStamp, 10))
      };
    }
  }
  return null;
};

export const getBalance = (balanceReport: GetBalanceResponse | null) => {
  if (balanceReport) {
    const { result } = balanceReport;
    return bigify(fromWei(Wei(result), 'ether')).toFixed(6);
  }
  return null;
};
