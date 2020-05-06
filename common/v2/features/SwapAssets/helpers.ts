import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { Asset, StoreAccount, ITxConfig, ITxObject, TAddress } from 'v2/types';
import { getAssetByUUID, getAssetByTicker, DexService } from 'v2/services';
import { hexToString, appendGasPrice, appendSender } from 'v2/services/EthService';
import { WALLET_STEPS } from 'v2/components';
import { weiToFloat } from 'v2/utils';

import { ISwapAsset, IAssetPair, LAST_CHANGED_AMOUNT } from './types';

export const getTradeOrder = (assetPair: IAssetPair, account: StoreAccount) => async () => {
  const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount } = assetPair;
  const { address, network } = account;
  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;
  // Trade order details depends on the direction of the asset exchange.
  const getOrderDetails = isLastChangedTo
    ? DexService.instance.getOrderDetailsTo
    : DexService.instance.getOrderDetailsFrom;

  return getOrderDetails(
    fromAsset.symbol,
    toAsset.symbol,
    (isLastChangedTo ? toAmount : fromAmount).toString()
  )
    .then(txs => Promise.all(txs.map(appendSender(address))))
    .then(txs => Promise.all(txs.map(appendGasPrice(network))));
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

export const makeTxObject = (config: ITxConfig): ITxObject => {
  return {
    to: config.receiverAddress as TAddress,
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
