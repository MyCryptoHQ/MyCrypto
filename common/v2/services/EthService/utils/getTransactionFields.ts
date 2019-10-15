import Tx from 'ethereumjs-tx';

import { IHexStrTransaction } from 'v2/types';
import { hexEncodeData, hexEncodeQuantity } from './hexEncode';

export const getTransactionFields = (t: Tx): IHexStrTransaction => {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const { data, gasLimit, gasPrice, to, nonce, value } = t;
  const chainId = t.getChainId();

  return {
    value: hexEncodeQuantity(value),
    data: hexEncodeData(data),
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: hexEncodeData(to),
    // Everything else is as-is
    nonce: hexEncodeQuantity(nonce),
    gasPrice: hexEncodeQuantity(gasPrice),
    gasLimit: hexEncodeQuantity(gasLimit),
    chainId
  };
};
