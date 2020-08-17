import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';

import {
  IFormikFields,
  ITxObject,
  IHexStrTransaction,
  Asset,
  IHexStrWeb3Transaction,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue
} from '@types';

import {
  Address,
  toWei,
  TokenValue,
  inputGasPriceToHex,
  inputValueToHex,
  inputNonceToHex,
  inputGasLimitToHex,
  encodeTransfer
} from '@services/EthService';

const createBaseTxObject = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const { network } = formData;
  return {
    to: formData.address.value as ITxToAddress,
    value: formData.amount ? inputValueToHex(formData.amount) : ('0x0' as ITxValue),
    data: formData.txDataField ? formData.txDataField : ('0x0' as ITxData),
    gasLimit: inputGasLimitToHex(formData.gasLimitField),
    gasPrice: formData.advancedTransaction
      ? inputGasPriceToHex(formData.gasPriceField)
      : inputGasPriceToHex(formData.gasPriceSlider),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

const createERC20TxObject = (formData: IFormikFields): IHexStrTransaction => {
  const { asset, network } = formData;
  return {
    to: asset.contractAddress! as ITxToAddress,
    value: '0x0' as ITxValue,
    data: bufferToHex(
      encodeTransfer(
        Address(formData.address.value),
        formData.amount !== '' ? toWei(formData.amount, asset.decimal!) : TokenValue(new BN(0))
      )
    ) as ITxData,
    gasLimit: inputGasLimitToHex(formData.gasLimitField) as ITxGasLimit,
    gasPrice: formData.advancedTransaction
      ? (inputGasPriceToHex(formData.gasPriceField) as ITxGasPrice)
      : (inputGasPriceToHex(formData.gasPriceSlider) as ITxGasPrice),
    nonce: inputNonceToHex(formData.nonceField) as ITxNonce,
    chainId: network.chainId ? network.chainId : 1
  };
};

export const isERC20Tx = (asset: Asset): boolean => {
  return !!(asset.type === 'erc20' && asset.contractAddress && asset.decimal);
};

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  return transform(formData);
};

export const processFormForEstimateGas = (formData: IFormikFields): IHexStrWeb3Transaction => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  // First we use destructuring to remove the `gasLimit` field from the object that is not used by IHexStrWeb3Transaction
  // then we add the extra properties required.
  const { gasLimit, ...tx } = transform(formData);
  return {
    ...tx,
    from: formData.account.address,
    gas: inputGasLimitToHex(formData.gasLimitField)
  };
};
