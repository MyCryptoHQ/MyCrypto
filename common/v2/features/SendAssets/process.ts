import { bufferToHex } from 'ethereumjs-util';
import BN from 'bn.js';

import { getAssetByTicker, getNetworkById } from 'v2/services/Store';
import { ITxFields } from 'v2/features/SendAssets/types';
import { Asset, Network, IHexStrWeb3Transaction, IHexStrTransaction } from 'v2/types';

import {
  Address,
  TokenValue,
  toWei,
  toTokenBase,
  encodeTransfer,
  hexEncodeQuantity
} from 'v2/services/EthService';

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
        ? txFields.isGasLimitManual
          ? txFields.gasLimitField
          : txFields.gasLimitEstimated
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
        ? txFields.isGasLimitManual
          ? txFields.gasLimitField
          : txFields.gasLimitEstimated
        : txFields.gasLimitEstimated,
      gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
      nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};

export const processFormDataToTx = (formData: ITxFields): IHexStrTransaction | undefined => {
  if (formData.asset && formData.asset.symbol) {
    const symbol = formData.asset.symbol;
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
      const rawTransaction: IHexStrTransaction = {
        to: txFields.recipientAddress,
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
            Address(txFields.recipientAddress),
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
