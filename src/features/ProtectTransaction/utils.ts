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
import {
  fromWei,
  gasStringsToMaxGasNumber,
  totalTxFeeToWei,
  Wei
} from '@services/EthService/utils';
import { IFormikFields, TAddress } from '@types';
import { bigify, formatDate, isSameAddress } from '@utils';

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

  const fixedHalfDollar = PROTECTED_TX_FIXED_FEE_AMOUNT / rate;

  let fixedFee = 0;
  try {
    fixedFee = parseFloat((parseFloat(amount) * PROTECTED_TX_FEE_PERCENTAGE).toString());
  } catch (e) {
    console.error(e);
  }

  const mainTransactionWei = parseFloat(
    fromWei(Wei(totalTxFeeToWei(gasPrice, gasLimitField)), 'ether')
  );

  const protectedTransactionWei = gasStringsToMaxGasNumber(gasPrice, gasLimitField);

  return {
    amount: bigify((fixedHalfDollar + fixedFee - mainTransactionWei).toString()),
    fee: bigify(protectedTransactionWei.toString())
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

  if (!isPTXFree && (!rate || rate <= 0 || parseFloat(amount) < PROTECTED_TX_MIN_AMOUNT / rate)) {
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
        value: parseFloat(fromWei(Wei(value), 'ether')).toFixed(6),
        timestamp: formatDate(parseInt(timeStamp, 10))
      };
    }
  }
  return null;
};

export const getBalance = (balanceReport: GetBalanceResponse | null) => {
  if (balanceReport) {
    const { result } = balanceReport;
    return parseFloat(fromWei(Wei(result), 'ether')).toFixed(6);
  }
  return null;
};
