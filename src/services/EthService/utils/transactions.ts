import { addHexPrefix } from 'ethereumjs-util';
import { Optional } from 'utility-types';

import { fetchGasPriceEstimates, getGasEstimate } from '@services/ApiService';
import {
  getNonce,
  hexToNumber,
  hexWeiToString,
  inputGasLimitToHex,
  inputGasPriceToHex,
  inputNonceToHex
} from '@services/EthService';
import { ITxFromAddress, ITxGasPrice, ITxObject, Network, TAddress } from '@types';
import { bigify } from '@utils';

type TxBeforeSender = Pick<ITxObject, 'to' | 'value' | 'data' | 'chainId'>;
type TxBeforeGasPrice = Optional<ITxObject, 'nonce' | 'gasLimit' | 'gasPrice'>;
type TxBeforeGasLimit = Optional<ITxObject, 'nonce' | 'gasLimit'>;
type TxBeforeNonce = Optional<ITxObject, 'nonce'>;

export const appendSender = (senderAddress: ITxFromAddress) => async (
  tx: TxBeforeSender
): Promise<TxBeforeGasPrice> => {
  return {
    ...tx,
    from: senderAddress
  };
};

export const appendGasPrice = (network: Network) => async (
  tx: TxBeforeGasPrice
): Promise<TxBeforeGasLimit> => {
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
    gasPrice: gasPrice as ITxGasPrice
  };
};

export const appendGasLimit = (network: Network) => async (
  tx: TxBeforeGasLimit
): Promise<TxBeforeNonce> => {
  // Respect gas limit if present
  if (tx.gasLimit) {
    return tx as TxBeforeNonce;
  }
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
  tx: TxBeforeNonce
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
