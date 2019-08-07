import BN from 'bn.js';
import { utils } from 'ethers';
import { bufferToHex, addHexPrefix } from 'ethereumjs-util';

import { IFormikFields } from 'v2/features/SendAssets/types';
import { IHexStrTransaction, Asset, Network, IHexStrWeb3Transaction } from 'v2/types';
import {
  encodeTransfer,
  hexEncodeQuantity,
  Address,
  toWei,
  TokenValue,
  toTokenBase,
  gasPriceToBase
} from 'v2/services/EthService';

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction | undefined => {
  const asset: Asset = formData.asset;
  const network: Network = formData.network;

  if (asset.type === 'base') {
    /* If base asset is being sent */
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
      gasPrice: formData.advancedTransaction
        ? addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceField)).toString(16))
        : addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceSlider)).toString(16)),
      nonce: addHexPrefix(parseInt(formData.nonceField, 10).toString(16)),
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  } else if (asset.type === 'erc20') {
    /* If erc20 asset is being sent */
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
      gasPrice: formData.advancedTransaction
        ? addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceField)).toString(16))
        : addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceSlider)).toString(16)),
      nonce: addHexPrefix(parseInt(formData.nonceField, 10).toString(16)),
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
      gas: utils.bigNumberify(formData.gasLimitField).toHexString(),
      gasPrice: formData.advancedTransaction
        ? addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceField)).toString(16))
        : addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceSlider)).toString(16)),
      nonce: addHexPrefix(parseInt(formData.nonceField, 10).toString(16)),
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
      gas: utils.bigNumberify(formData.gasLimitField).toHexString(),
      gasPrice: formData.advancedTransaction
        ? addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceField)).toString(16))
        : addHexPrefix(gasPriceToBase(parseFloat(formData.gasPriceSlider)).toString(16)),
      nonce: addHexPrefix(parseInt(formData.nonceField, 10).toString(16)), //bufferToHex(toBuffer(formData.nonceField)),
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};
