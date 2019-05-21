import { TransactionFields } from 'v2/features/SendAssets/SendAssets';
import { IHexStrWeb3Transaction } from './typings';
import { AssetOption } from 'v2/services/AssetOption/types';
import { getAssetByTicker } from '../assetOptions';
import { getNetworkById } from '../networks/networks';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

import { Address, TokenValue, toWei } from '../units';
import BN from 'bn.js';
import { encodeTransfer } from './utils/token';
import { bufferToHex } from 'ethereumjs-util';

export const processFormDataToTx = (
  formData: TransactionFields
): IHexStrWeb3Transaction | undefined => {
  const asset: AssetOption | undefined = getAssetByTicker(formData.asset);

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
      from: txFields.senderAddress,
      to: txFields.recipientAddress,
      value: txFields.amount ? txFields.amount : '0x0',
      data: txFields.data ? txFields.data : '',
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
      from: txFields.senderAddress,
      to: asset.contractAddress,
      value: '',
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
