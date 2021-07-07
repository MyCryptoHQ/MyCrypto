import queryString from 'querystring';

import { ISimpleTxForm, ITxConfig, TxQueryTypes } from '@types';
import { inputGasLimitToHex, inputGasPriceToHex } from '@utils';
import { mapObjIndexed } from '@vendor';

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

export const constructCancelTxQuery = (
  txConfig: ITxConfig,
  newGasPrice:
    | Pick<ISimpleTxForm, 'maxFeePerGas' | 'maxPriorityFeePerGas'>
    | Pick<ISimpleTxForm, 'gasPrice'>
): string => {
  const cancelTxQueryParams = createQueryParamsDefaultObject(txConfig, TxQueryTypes.CANCEL);
  const gas = mapObjIndexed((v) => v && inputGasPriceToHex(v), newGasPrice);
  return queryString.stringify({
    ...cancelTxQueryParams,
    to: cancelTxQueryParams.from,
    data: '0x',
    value: '0x0',
    gasLimit: inputGasLimitToHex('21000'),
    ...gas
  });
};

export const constructSpeedUpTxQuery = (
  txConfig: ITxConfig,
  newGasPrice:
    | Pick<ISimpleTxForm, 'maxFeePerGas' | 'maxPriorityFeePerGas'>
    | Pick<ISimpleTxForm, 'gasPrice'>
): string => {
  const unfinishedSpeedUpTxQueryParams = createQueryParamsDefaultObject(
    txConfig,
    TxQueryTypes.SPEEDUP
  );
  const gas = mapObjIndexed((v) => v && inputGasPriceToHex(v), newGasPrice);
  return queryString.stringify({
    ...unfinishedSpeedUpTxQueryParams,
    ...gas
  });
};
