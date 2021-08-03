import { WALLET_STEPS } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { getAssetByTicker, getAssetByUUID } from '@services';
import { ISwapAsset, ITxConfig, ITxObject, StoreAccount, StoreAsset, TUuid } from '@types';
import { toTokenBase, weiToFloat } from '@utils';

export const makeSwapTxConfig = (assets: StoreAsset[]) => (
  transaction: ITxObject,
  account: StoreAccount,
  fromAsset: ISwapAsset,
  fromAmount: string
): ITxConfig => {
  const { address, network } = account;
  const baseAsset = getAssetByUUID(assets)(network.baseAsset)!;
  const asset = getAssetByTicker(assets)(fromAsset.ticker) || baseAsset;

  const txConfig: ITxConfig = {
    from: address,
    amount: fromAmount,
    receiverAddress: address,
    senderAccount: account,
    networkId: network.id,
    asset,
    baseAsset,
    rawTransaction: Object.assign({}, transaction, { chainId: network.chainId })
  };

  return txConfig;
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
