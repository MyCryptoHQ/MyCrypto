import { addHexPrefix } from 'ethereumjs-util';

import { bigify } from 'v2/utils';
import {
  TAddress,
  Network,
  ITxObject,
  ITxObjectBeforeSender,
  ITxObjectBeforeGasPrice,
  ITxObjectBeforeGasLimit,
  ITxObjectBeforeNonce
} from 'v2/types';
import {
  inputGasPriceToHex,
  inputGasLimitToHex,
  inputNonceToHex,
  hexWeiToString,
  getNonce,
  hexToNumber
} from 'v2/services/EthService';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';

export const appendSender = (senderAddress: TAddress) => async (
  tx: ITxObjectBeforeSender
): Promise<ITxObjectBeforeGasPrice> => {
  return {
    ...tx,
    from: senderAddress
  };
};

export const appendGasPrice = (network: Network) => async (
  tx: ITxObjectBeforeGasPrice
): Promise<ITxObjectBeforeGasLimit> => {
  const gasPrice = await fetchGasPriceEstimates(network)
    .then(({ fast }) => fast.toString())
    .then(inputGasPriceToHex)
    .then(hexWeiToString)
    .then((v) => bigify(v).toString(16))
    .then(addHexPrefix)
    .catch((err) => {
      throw new Error(`getGasPriceEstimate: ${err}`);
    });

  return {
    ...tx,
    gasPrice
  };
};

export const appendGasLimit = (network: Network) => async (
  tx: ITxObjectBeforeGasLimit
): Promise<ITxObjectBeforeNonce> => {
  try {
    const gasLimit = await getGasEstimate(network, tx)
      .then(hexToNumber)
      .then((n: number) => Math.round(n * 1.2))
      .then((n: number) => inputGasLimitToHex(n.toString()));

    return {
      ...tx,
      gasLimit
    };
  } catch (err) {
    throw new Error(`getGasEstimate: ${err}`);
  }
};

export const appendNonce = (network: Network, senderAddress: TAddress) => async (
  tx: ITxObjectBeforeNonce
): Promise<ITxObject> => {
  const nonce = await getNonce(network, senderAddress)
    .then((n) => n.toString())
    .then(inputNonceToHex)
    .catch((err) => {
      throw new Error(`getNonce: ${err}`);
    });

  return {
    ...tx,
    nonce
  };
};
