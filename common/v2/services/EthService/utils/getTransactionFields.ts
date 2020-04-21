import { Transaction as Tx } from 'ethereumjs-tx';

import { hexEncodeData, hexEncodeQuantity } from './hexEncode';
import { ITxObject, TAddress } from 'v2/types';

export const getTransactionFields = (t: Tx): ITxObject => {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const { data, gasLimit, gasPrice, to, nonce, value } = t;
  const chainId = t.getChainId();

  return {
    value: hexEncodeQuantity(value),
    data: hexEncodeData(data),
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: hexEncodeData(to) as TAddress,
    // Everything else is as-is
    nonce: hexEncodeQuantity(nonce),
    gasPrice: hexEncodeQuantity(gasPrice),
    gasLimit: hexEncodeQuantity(gasLimit),
    chainId
  };
};
