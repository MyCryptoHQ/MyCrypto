import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { WALLET_STEPS } from '@components';
import { DexService, getAssetByTicker, getAssetByUUID } from '@services';
import { appendGasPrice, appendSender, hexToString } from '@services/EthService';
import {
  IHexStrTransaction,
  ISwapAsset,
  ITxConfig,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxObject,
  ITxValue,
  StoreAccount,
  StoreAsset
} from '@types';
import { weiToFloat } from '@utils';

import { IAssetPair, LAST_CHANGED_AMOUNT } from './types';

export const getTradeOrder = (assetPair: IAssetPair, account: StoreAccount) => async () => {
  const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount } = assetPair;
  const { address, network } = account;
  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;
  // Trade order details depends on the direction of the asset exchange.
  const getOrderDetails = isLastChangedTo
    ? DexService.instance.getOrderDetailsTo
    : DexService.instance.getOrderDetailsFrom;

  return getOrderDetails(
    fromAsset.ticker,
    toAsset.ticker,
    (isLastChangedTo ? toAmount : fromAmount).toString()
  )
    .then((txs) => Promise.all(txs.map(appendSender(address))))
    .then((txs) => Promise.all(txs.map(appendGasPrice(network))));
};

export const makeSwapTxConfig = (assets: StoreAsset[]) => (
  transaction: ITxObject,
  account: StoreAccount,
  fromAsset: ISwapAsset,
  fromAmount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data } = transaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(assets)(network.baseAsset)!;
  const asset = getAssetByTicker(assets)(fromAsset.ticker) || baseAsset;

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
    data: config.data as ITxData,
    value: addHexPrefix(new BN(config.amount).toString(16)) as ITxValue,
    gasPrice: addHexPrefix(new BN(config.gasPrice).toString(16)) as ITxGasPrice,
    gasLimit: config.gasLimit as ITxGasLimit,
    nonce: config.nonce as ITxNonce
  };
};

// filter accounts based on wallet type and sufficient balance
// @todo: include fees check
export const getAccountsWithAssetBalance = (
  accounts: StoreAccount[],
  fromAsset: ISwapAsset,
  fromAmount: string
) =>
  accounts.filter((acc) => {
    if (!WALLET_STEPS[acc.wallet]) {
      return false;
    }

    const asset = acc.assets.find((x) => x.ticker === fromAsset.ticker);
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
    : assets.filter((x) => fromAsset.ticker !== x.ticker && toAsset.ticker !== x.ticker);
