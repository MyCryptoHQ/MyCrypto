import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';

import { IFormikFields } from 'v2/features/SendAssets/types';
import { IHexStrTransaction, Asset, Network, IHexStrWeb3Transaction } from 'v2/types';
import {
  encodeTransfer,
  Address,
  toWei,
  TokenValue,
  inputGasPriceToHex,
  inputValueToHex,
  inputNonceToHex,
  inputGasLimitToHex
} from 'v2/services/EthService';

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction => {
  const asset: Asset = formData.asset;
  const network: Network = formData.network;

  if (asset.type === 'erc20' && asset.contractAddress && asset.decimal) {
    /* If erc20 asset is being sent */
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
        ? inputGasPriceToHex(formData.gasPriceField)
        : inputGasPriceToHex(formData.gasPriceSlider),
      nonce: inputNonceToHex(formData.nonceField),
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  } else {
    const rawTransaction: IHexStrTransaction = {
      to:
        formData.resolvedENSAddress === '0x0'
          ? formData.receiverAddress
          : formData.resolvedENSAddress,
      value: formData.amount ? inputValueToHex(formData.amount) : '0x0',
      data: formData.txDataField ? formData.txDataField : '0x0',
      gasLimit: formData.gasLimitField,
      gasPrice: formData.advancedTransaction
        ? inputGasPriceToHex(formData.gasPriceField)
        : inputGasPriceToHex(formData.gasPriceSlider),
      nonce: inputNonceToHex(formData.nonceField),
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
      value: formData.amount ? inputValueToHex(formData.amount) : '0x0',
      data: formData.txDataField ? formData.txDataField : '0x0',
      gas: inputGasLimitToHex(formData.gasLimitField),
      gasPrice: formData.advancedTransaction
        ? inputGasPriceToHex(formData.gasPriceField)
        : inputGasPriceToHex(formData.gasPriceSlider),
      nonce: inputNonceToHex(formData.nonceField),
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  } else if (asset.type === 'erc20' && asset.contractAddress && asset.decimal) {
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
      gas: inputGasLimitToHex(formData.gasLimitField),
      gasPrice: formData.advancedTransaction
        ? inputGasPriceToHex(formData.gasPriceField)
        : inputGasPriceToHex(formData.gasPriceSlider),
      nonce: inputNonceToHex(formData.nonceField),
      chainId: network.chainId ? network.chainId : 1
    };
    return rawTransaction;
  }
};
