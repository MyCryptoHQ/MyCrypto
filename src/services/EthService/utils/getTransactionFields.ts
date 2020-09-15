import { Transaction as Tx } from 'ethereumjs-tx';

import {
  IHexStrTransaction,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue
} from '@types';

import { hexEncodeData, hexEncodeQuantity } from './hexEncode';

export const getTransactionFields = (t: Tx): IHexStrTransaction => {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const { data, gasLimit, gasPrice, to, nonce, value } = t;
  const chainId = t.getChainId();

  return {
    value: hexEncodeQuantity(value) as ITxValue,
    data: hexEncodeData(data) as ITxData,
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: hexEncodeData(to) as ITxToAddress,
    // Everything else is as-is
    nonce: hexEncodeQuantity(nonce) as ITxNonce,
    gasPrice: hexEncodeQuantity(gasPrice) as ITxGasPrice,
    gasLimit: hexEncodeQuantity(gasLimit) as ITxGasLimit,
    chainId
  };
};
