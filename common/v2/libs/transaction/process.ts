import { ITxFields } from 'v2/features/SendAssets/types';
import { IHexStrWeb3Transaction, IHexStrTransaction } from './typings';
import { AssetOption } from 'v2/services/AssetOption/types';
import { getAssetByTicker } from '../assetOptions';
import { getNetworkById } from '../networks/networks';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

import { Address, TokenValue, toWei, toTokenBase } from '../units';
import BN from 'bn.js';
import { encodeTransfer } from './utils/token';
import { bufferToHex } from 'ethereumjs-util';
import { hexEncodeQuantity } from '../nodes/rpc/utils';

export const processFormDataToWeb3Tx = (
  formData: ITxFields
): IHexStrWeb3Transaction | undefined => {
  const symbol = formData.asset!.symbol;
  const asset: AssetOption | undefined = getAssetByTicker(symbol);

  const txFields = formData;

  if (!asset) {
    return undefined;
  }

  const network: NetworkOptions | undefined = getNetworkById(asset.network);

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

export const processFormDataToTx = (formData: ITxFields): IHexStrTransaction | undefined => {
  const symbol = formData.asset!.symbol;
  const asset: AssetOption | undefined = getAssetByTicker(symbol);

  const txFields = formData;

  if (!asset) {
    return undefined;
  }

  const network: NetworkOptions | undefined = getNetworkById(asset.network);

  if (!network) {
    return undefined;
  }

  if (asset.type === 'base') {
    if (!asset.decimal) {
      return undefined;
    }
    const rawTransaction: IHexStrTransaction = {
      to: txFields.recipientAddress,
      value: txFields.amount
        ? hexEncodeQuantity(toTokenBase(txFields.amount, asset.decimal))
        : '0x0',
      data: txFields.data ? txFields.data : '0x0',
      gasLimit: txFields.isAdvancedTransaction
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

    const rawTransaction: IHexStrTransaction = {
      to: asset.contractAddress,
      value: '0x0',
      data: bufferToHex(
        encodeTransfer(
          Address(txFields.recipientAddress),
          txFields.amount !== '' ? toWei(txFields.amount, asset.decimal) : TokenValue(new BN(0))
        )
      ),
      gasLimit: txFields.isAdvancedTransaction
        ? txFields.isGasLimitManual ? txFields.gasLimitField : txFields.gasLimitEstimated
        : txFields.gasLimitEstimated,
      gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
      nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};
