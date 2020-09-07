import queryString from 'querystring';
import { ITxConfig, TxQueryTypes } from '@types';
import { inputGasLimitToHex, inputGasPriceToHex } from '@services';

export function getParam(query: { [key: string]: string }, key: string) {
  const keys = Object.keys(query);
  const index = keys.findIndex((k) => k.toLowerCase() === key.toLowerCase());
  if (index === -1) {
    return null;
  }
  return query[keys[index]];
}

export const createQueryParamsDefaultObject = (txConfig: ITxConfig, type: TxQueryTypes) => {
  const { to, from, gasLimit, nonce, chainId, value, data } = txConfig.rawTransaction;
  const senderAddress = txConfig.senderAccount?.address;
  return {
    type,
    from: from || senderAddress,
    to,
    gasLimit,
    nonce,
    chainId,
    value,
    data
  };
};

export const constructCancelTxQuery = (txConfig: ITxConfig, newGasPrice: number): string => {
  const unfinishedSpeedUpTxQueryParams = createQueryParamsDefaultObject(
    txConfig,
    TxQueryTypes.CANCEL
  );
  return queryString.stringify({
    ...unfinishedSpeedUpTxQueryParams,
    to: unfinishedSpeedUpTxQueryParams.from,
    data: '0x0',
    value: '0x0',
    gasLimit: inputGasLimitToHex('21000'),
    gasPrice: inputGasPriceToHex(newGasPrice.toString())
  });
};

export const constructSpeedUpTxQuery = (txConfig: ITxConfig, newGasPrice: number): string => {
  const unfinishedSpeedUpTxQueryParams = createQueryParamsDefaultObject(
    txConfig,
    TxQueryTypes.SPEEDUP
  );
  return queryString.stringify({
    ...unfinishedSpeedUpTxQueryParams,
    gasPrice: inputGasPriceToHex(newGasPrice.toString())
  });
};
