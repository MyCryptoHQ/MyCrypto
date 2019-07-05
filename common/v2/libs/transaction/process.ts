import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';
import { ITxFields, SendState } from 'v2/features/SendAssets/types';
import { getAssetByTicker } from 'v2/libs/assets';
import { Asset } from 'v2/services/Asset/types';
import { Network } from 'v2/services/Network/types';
import { getNetworkById } from '../networks/networks';
import { hexEncodeQuantity } from '../nodes/rpc/utils';
import { Address, TokenValue, toTokenBase, toWei } from '../units';
import { IHexStrTransaction, IHexStrWeb3Transaction } from './typings';
import { encodeTransfer } from './utils/token';

export const processFormDataToWeb3Tx = (
  formData: ITxFields
): IHexStrWeb3Transaction | undefined => {
  const symbol = formData.asset!.symbol;
  const asset: Asset | undefined = getAssetByTicker(symbol);

  const txFields = formData;

  if (!asset || !asset.networkId) {
    return undefined;
  }

  const network: Network | undefined = getNetworkById(asset.networkId);

  if (!network) {
    return undefined;
  }

  if (asset.type === 'base') {
    if (!asset.decimal) {
      return undefined;
    }
    const rawTransaction: IHexStrWeb3Transaction = {
      from: txFields.account.address,
      to: txFields.recipientAddress,
      value: txFields.amount
        ? hexEncodeQuantity(toTokenBase(txFields.amount, asset.decimal))
        : '0x0',
      data: txFields.data ? txFields.data : '0x0',
      gas: txFields.isAdvancedTransaction
        ? txFields.isGasLimitManual ? txFields.gasLimitField : txFields.gasLimitEstimated
        : txFields.gasLimitEstimated,
      gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
      nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  } else if (asset.type === 'erc20') {
    if (!asset.contractAddress || !asset.decimal) {
      return undefined;
    }

    const rawTransaction: IHexStrWeb3Transaction = {
      from: txFields.account.address,
      to: asset.contractAddress,
      value: '0x0',
      data: bufferToHex(
        encodeTransfer(
          Address(txFields.recipientAddress),
          txFields.amount !== '' ? toWei(txFields.amount, asset.decimal) : TokenValue(new BN(0))
        )
      ),
      gas: txFields.isAdvancedTransaction
        ? txFields.isGasLimitManual ? txFields.gasLimitField : txFields.gasLimitEstimated
        : txFields.gasLimitEstimated,
      gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
      nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};

export const processFormDataToTx = (
  formData: Partial<SendState>
): IHexStrTransaction | undefined => {
  if (
    formData.sharedConfig &&
    formData.sharedConfig.assetType &&
    formData.sharedConfig.assetSymbol
  ) {
    const symbol = formData.sharedConfig.assetSymbol;
    const asset: Asset | undefined = getAssetByTicker(symbol);
    console.log(asset);
    const txFields = formData;

    if (!asset || !asset.networkId) {
      return undefined;
    }

    const network: Network | undefined = getNetworkById(asset.networkId);

    if (!network) {
      return undefined;
    }

    if (asset.type === 'base') {
      if (!asset.decimal) {
        return undefined;
      }
      const rawTransaction: IHexStrTransaction = {
        to: txFields.resolvedNSAddress ? txFields.resolvedNSAddress : txFields.recipientAddress,
        value: txFields.amount
          ? hexEncodeQuantity(toTokenBase(txFields.amount, asset.decimal))
          : '0x0',
        data: txFields.data ? txFields.data : '0x0',
        gasLimit:
          txFields.isAdvancedTransaction && txFields.isGasLimitManual
            ? txFields.gasLimitField
            : txFields.gasLimitEstimated,
        gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
        nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
        chainId: network.chainId ? network.chainId : 1
      };
      return rawTransaction;
    } else if (asset.type === 'erc20') {
      if (!asset.contractAddress || !asset.decimal) {
        return undefined;
      }

      const rawTransaction: IHexStrTransaction = {
        to: asset.contractAddress,
        value: '0x0',
        data: bufferToHex(
          encodeTransfer(
            Address(
              txFields.resolvedNSAddress ? txFields.resolvedNSAddress : txFields.recipientAddress
            ),
            txFields.amount !== '' ? toWei(txFields.amount, asset.decimal) : TokenValue(new BN(0))
          )
        ),
        gasLimit:
          txFields.isAdvancedTransaction && txFields.isGasLimitManual
            ? txFields.gasLimitField
            : txFields.gasLimitEstimated,
        gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
        nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
        chainId: network.chainId ? network.chainId : 1
      };
      return rawTransaction;
    }
  }
};
