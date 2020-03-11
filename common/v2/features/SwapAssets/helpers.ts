import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import { Optional } from 'utility-types';

import {
  TAddress,
  Asset,
  StoreAccount,
  Network,
  ITxConfig,
  IHexStrTransaction,
  ITxObject
} from 'v2/types';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import {
  inputGasPriceToHex,
  inputGasLimitToHex,
  inputNonceToHex,
  hexWeiToString,
  getNonce,
  hexToNumber,
  hexToString
} from 'v2/services/EthService';
import { getAssetByUUID, getAssetByTicker } from 'v2/services';
import { WALLET_STEPS } from 'v2/components';
import { weiToFloat } from 'v2/utils';

import { ISwapAsset } from './types';

type TxBeforeSender = Pick<ITxObject, 'to' | 'value' | 'data' | 'chainId'>;
type TxBeforeGasPrice = Optional<ITxObject, 'nonce' | 'gasLimit' | 'gasPrice'>;
type TxBeforeGasLimit = Optional<ITxObject, 'nonce' | 'gasLimit'>;
type TxBeforeNonce = Optional<ITxObject, 'nonce'>;

export const appendSender = (senderAddress: TAddress) => async (
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
    .then(v => new BN(v).toString(16))
    .then(addHexPrefix)
    .catch(err => {
      throw new Error(`getGasPriceEstimate: ${err}`);
    });

  return {
    ...tx,
    gasPrice
  };
};

export const appendGasLimit = (network: Network) => async (
  tx: TxBeforeGasLimit
): Promise<TxBeforeNonce> => {
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
    .then(n => n.toString())
    .then(inputNonceToHex)
    .catch(err => {
      throw new Error(`getNonce: ${err}`);
    });

  return {
    ...tx,
    nonce
  };
};

export const makeTxConfigFromTransaction = (assets: Asset[]) => (
  transaction: ITxObject,
  account: StoreAccount,
  fromAsset: ISwapAsset,
  fromAmount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data } = transaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(assets)(network.baseAsset)!;
  const asset = getAssetByTicker(assets)(fromAsset.symbol) || baseAsset;

  const txConfig: ITxConfig = {
    from: address,
    amount: fromAmount,
    receiverAddress: address,
    senderAccount: account,
    network,
    asset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit,
    value: fromAmount,
    nonce,
    data,
    rawTransaction: Object.assign({}, transaction, { chainId: network.chainId, to: address })
  };

  return txConfig;
};

export const makeTxObject = (config: ITxConfig): IHexStrTransaction => {
  return {
    to: config.receiverAddress,
    chainId: config.network.chainId,
    data: config.data,
    value: addHexPrefix(new BN(config.amount).toString(16)),
    gasPrice: addHexPrefix(new BN(config.gasPrice).toString(16)),
    gasLimit: config.gasLimit,
    nonce: config.nonce
  };
};

// filter accounts based on wallet type and sufficient balance
// TODO: include fees check
export const getAccountsWithAssetBalance = (
  accounts: StoreAccount[],
  fromAsset: ISwapAsset,
  fromAmount: string
) =>
  accounts.filter(acc => {
    if (!WALLET_STEPS[acc.wallet]) {
      return false;
    }

    const asset = acc.assets.find(x => x.ticker === fromAsset.symbol);
    if (!asset) {
      return false;
    }

    const amount = weiToFloat(asset.balance, asset.decimal);
    if (amount < Number(fromAmount)) {
      return false;
    }

    return true;
  });

export const getUnselectedAssets = (
  assets: ISwapAsset[],
  fromAsset: ISwapAsset,
  toAsset: ISwapAsset
) =>
  !toAsset || !fromAsset
    ? assets
    : assets.filter(x => fromAsset.symbol !== x.symbol && toAsset.symbol !== x.symbol);
