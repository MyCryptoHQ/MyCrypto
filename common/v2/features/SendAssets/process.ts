// import { bufferToHex } from 'ethereumjs-util';
// import BN from 'bn.js';

import { IFormikFields } from 'v2/features/SendAssets/types';
import {
  // Asset,
  // Network,
  IHexStrTransaction,
  Asset,
  Network,
  IHexStrWeb3Transaction
  // IHexStrTransaction
} from 'v2/types';
import { bufferToHex } from 'ethereumjs-util';
import { Address, toWei, TokenValue, toTokenBase } from 'v2/services/EthService/utils/units';
import BN from 'bn.js';
import { encodeTransfer } from 'v2/services/EthService/contracts/token';
import { hexEncodeQuantity } from 'v2/services/EthService/utils/hexEncode';

// import {
//   Address,
//   TokenValue,
//   toWei,
//   toTokenBase,
//   encodeTransfer,
//   hexEncodeQuantity
// } from 'v2/services/EthService';

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction | undefined => {
  const asset: Asset = formData.asset;
  const network: Network = formData.network;

  if (asset.type === 'base') {
    if (!asset.decimal) {
      return undefined;
    }
    const rawTransaction: IHexStrTransaction = {
      to:
        formData.resolvedENSAddress === '0x0'
          ? formData.receiverAddress
          : formData.resolvedENSAddress,
      value: formData.amount
        ? hexEncodeQuantity(toTokenBase(formData.amount, asset.decimal))
        : '0x0',
      data: formData.txDataField ? formData.txDataField : '0x0',
      gasLimit: formData.gasLimitField,
      gasPrice: formData.advancedTransaction ? formData.gasPriceField : formData.gasPriceSlider,
      nonce: formData.nonceField,
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
            formData.resolvedENSAddress === '0x0'
              ? formData.receiverAddress
              : formData.resolvedENSAddress
          ),
          formData.amount !== '' ? toWei(formData.amount, asset.decimal) : TokenValue(new BN(0))
        )
      ),
      gasLimit: formData.gasLimitField,
      gasPrice: formData.advancedTransaction ? formData.gasPriceField : formData.gasPriceSlider,
      nonce: formData.nonceField,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};

export const processFormDataToWeb3Tx = (
  formData: IFormikFields
): IHexStrWeb3Transaction | undefined => {
  const asset: Asset = formData.asset;
  const network: Network = formData.network;

  if (asset.type === 'base') {
    if (!asset.decimal) {
      return undefined;
    }
    const rawTransaction: IHexStrWeb3Transaction = {
      to:
        formData.resolvedENSAddress === '0x0'
          ? formData.receiverAddress
          : formData.resolvedENSAddress,
      from: formData.account.address,
      value: formData.amount
        ? hexEncodeQuantity(toTokenBase(formData.amount, asset.decimal))
        : '0x0',
      data: formData.txDataField ? formData.txDataField : '0x0',
      gas: formData.gasLimitField,
      gasPrice: formData.advancedTransaction ? formData.gasPriceField : formData.gasPriceSlider,
      nonce: formData.nonceField,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  } else if (asset.type === 'erc20') {
    if (!asset.contractAddress || !asset.decimal) {
      return undefined;
    }
    const rawTransaction: IHexStrWeb3Transaction = {
      to: asset.contractAddress,
      value: '0x0',
      from: formData.account.address,
      data: bufferToHex(
        encodeTransfer(
          Address(
            formData.resolvedENSAddress === '0x0'
              ? formData.receiverAddress
              : formData.resolvedENSAddress
          ),
          formData.amount !== '' ? toWei(formData.amount, asset.decimal) : TokenValue(new BN(0))
        )
      ),
      gas: formData.gasLimitField,
      gasPrice: formData.advancedTransaction ? formData.gasPriceField : formData.gasPriceSlider,
      nonce: formData.nonceField,
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};
