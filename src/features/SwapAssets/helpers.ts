import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { WALLET_STEPS } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { getAssetByTicker, getAssetByUUID } from '@services';
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
  StoreAsset,
  TUuid
} from '@types';
import { hexToString, toTokenBase, weiToFloat } from '@utils';

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
    gasLimit: hexToString(gasLimit),
    value: fromAmount,
    nonce: hexToString(nonce),
    data,
    rawTransaction: Object.assign({}, transaction, { chainId: network.chainId })
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
export const getAccountsWithAssetBalance = (
  accounts: StoreAccount[],
  fromAsset: ISwapAsset,
  fromAmount: string,
  baseAssetUuid?: TUuid,
  baseAssetAmount?: string
) =>
  accounts.filter((acc) => {
    if (!WALLET_STEPS[acc.wallet]) {
      return false;
    }

    const asset = getAssetByUUID(acc.assets)(fromAsset.uuid) as StoreAsset;
    if (!asset) {
      return false;
    }

    const assetBalance = weiToFloat(asset.balance, asset.decimal);
    if (assetBalance.lt(fromAmount)) {
      return false;
    }

    if (!baseAssetUuid || !baseAssetAmount) {
      return true;
    }

    const baseAsset = getAssetByUUID(acc.assets)(baseAssetUuid) as StoreAsset;
    if (!baseAsset) {
      return false;
    }

    const baseAssetUsed =
      asset.uuid === baseAssetUuid
        ? toTokenBase(fromAmount, asset.decimal || DEFAULT_ASSET_DECIMAL)
        : 0;

    const baseAssetBalance = weiToFloat(
      baseAsset.balance.sub(baseAssetUsed.toString()),
      baseAsset.decimal
    );
    if (baseAssetBalance.lt(baseAssetAmount)) {
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
    : assets.filter((x) => fromAsset.uuid !== x.uuid && toAsset.uuid !== x.uuid);
