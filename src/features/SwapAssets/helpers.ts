import BigNumber from 'bignumber.js';

import { WALLET_STEPS } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { getAssetByTicker, getAssetByUUID, UniversalGasEstimationResult } from '@services';
import {
  ISwapAsset,
  ITxConfig,
  ITxGasLimit,
  ITxObject,
  StoreAccount,
  StoreAsset,
  TUuid
} from '@types';
import {
  bigify,
  calculateMinMaxFee,
  inputGasPriceToHex,
  totalTxFeeToString,
  toTokenBase,
  weiToFloat
} from '@utils';

export const makeSwapTxConfig = (assets: StoreAsset[]) => (
  transaction: ITxObject,
  account: StoreAccount,
  fromAsset: ISwapAsset,
  fromAmount: string
): ITxConfig => {
  const { address, network } = account;
  const baseAsset = getAssetByUUID(assets)(network.baseAsset)!;
  const asset = getAssetByTicker(assets)(fromAsset.ticker) ?? baseAsset;

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

export const getEstimatedGasFee = ({
  tradeGasLimit,
  approvalGasLimit,
  baseAssetRate,
  gas
}: {
  tradeGasLimit?: ITxGasLimit;
  approvalGasLimit?: ITxGasLimit;
  baseAssetRate?: number;
  gas?: { estimate: UniversalGasEstimationResult; baseFee?: BigNumber };
}) => {
  if (tradeGasLimit && gas?.estimate.maxFeePerGas) {
    const { avgFee } = calculateMinMaxFee({
      baseFee: gas.baseFee,
      ...gas.estimate,
      gasLimit:
        tradeGasLimit &&
        bigify(tradeGasLimit)
          .plus(approvalGasLimit ? approvalGasLimit : 0)
          .toString(),
      baseAssetRate
    });

    return avgFee.toFixed(6);
  }

  return (
    gas?.estimate.gasPrice &&
    tradeGasLimit &&
    totalTxFeeToString(
      inputGasPriceToHex(gas.estimate.gasPrice),
      bigify(tradeGasLimit).plus(approvalGasLimit ? approvalGasLimit : 0)
    )
  );
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
        ? toTokenBase(fromAmount, asset.decimal ?? DEFAULT_ASSET_DECIMAL)
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
