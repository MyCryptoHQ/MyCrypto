import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { Asset, StoreAccount, ITxConfig, IHexStrTransaction, ITxObject } from 'v2/types';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import {
  inputGasPriceToHex,
  hexWeiToString,
  getNonce,
  hexToNumber,
  hexToString
} from 'v2/services/EthService';
import { getAssetByUUID, getAssetByTicker } from 'v2/services';
import { WALLET_STEPS } from 'v2/components';
import { weiToFloat } from 'v2/utils';

import { ISwapAsset } from './types';

export const fetchTxInfo = async (tx, network, fromAddress) => {
  const gasPrice = await fetchGasPriceEstimates(network)
    .then(({ fast }) => fast.toString())
    .then(inputGasPriceToHex)
    .then(hexWeiToString)
    .then(v => new BN(v).toString(16))
    .then(addHexPrefix);

  const gasLimit = await getGasEstimate(network, tx)
    .then(hexToNumber)
    .then(n => n * 1.2);

  const nonce = await getNonce(network, fromAddress);

  return {
    ...tx,
    gasPrice,
    gasLimit,
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
