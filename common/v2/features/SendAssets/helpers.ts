import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';
import { utils } from 'ethers';

import { IFormikFields } from 'v2/features/SendAssets/types';
import { IHexStrTransaction, Asset, Network, IHexStrWeb3Transaction } from 'v2/types';

import {
  getNetworkByChainId,
  getBaseAssetByNetwork,
  getAssetByContractAndNetwork
} from 'v2/services/Store';
import {
  ERC20,
  fromWei,
  fromTokenBase,
  Wei,
  bigNumGasPriceToViewableGwei,
  bigNumGasLimitToViewable,
  bigNumValueToViewableEther,
  hexWeiToString,
  encodeTransfer,
  Address,
  toWei,
  TokenValue,
  inputGasPriceToHex,
  inputValueToHex,
  inputNonceToHex,
  inputGasLimitToHex
} from 'v2/services/EthService';

import { ITxObject, ITxConfig, ITxReceipt } from './types';

export function fromStateToTxObject(state: ITxConfig): ITxObject {
  const tx = state.rawTransaction;
  return {
    to: tx.to,
    value: tx.value,
    data: tx.data,
    gasLimit: tx.gasLimit,
    gasPrice: tx.gasPrice,
    nonce: tx.nonce,
    chainId: tx.chainId
  };
}

export function decodeTransaction(signedTx: string) {
  const decodedTransaction = utils.parseTransaction(signedTx);
  const gasLimit = bigNumGasLimitToViewable(decodedTransaction.gasLimit);
  const gasPriceGwei = bigNumGasPriceToViewableGwei(decodedTransaction.gasPrice);
  const amountToSendEther = bigNumValueToViewableEther(decodedTransaction.value);

  return {
    to: decodedTransaction.to,
    from: decodedTransaction.from,
    value: amountToSendEther.toString(),
    gasLimit: gasLimit.toString(),
    gasPrice: gasPriceGwei.toString(),
    nonce: decodedTransaction.nonce,
    data: decodedTransaction.data,
    chainId: decodedTransaction.chainId
  };
}

export async function getNetworkNameFromSignedTx(signedTx: string) {
  const decodedTransaction = utils.parseTransaction(signedTx);
  const chainId = decodedTransaction.chainId.toString();
  const network = await getNetworkByChainId(parseFloat(chainId));

  return network ? network.name : undefined;
}

export function fromTxReceiptObj(txReceipt: ITxReceipt): ITxReceipt | undefined {
  const chainId: number = txReceipt.networkId || txReceipt.chainId;
  const networkDetected = getNetworkByChainId(chainId);
  if (networkDetected) {
    const contractAsset = getAssetByContractAndNetwork(txReceipt.to, networkDetected);
    const baseAsset = getBaseAssetByNetwork(networkDetected);
    return {
      network: networkDetected,
      hash: txReceipt.hash,
      from: txReceipt.from,
      asset: contractAsset ? contractAsset : baseAsset ? baseAsset : undefined, // If contractAsset, use contractAsset, else if baseAsset, use baseAsset, else 'undefined'
      value: txReceipt.value.hex, // Hex - wei
      amount: contractAsset
        ? fromTokenBase(
            ERC20.transfer.decodeInput(txReceipt.data)._value,
            contractAsset.decimal || 18
          )
        : fromWei(Wei(hexWeiToString(txReceipt.value._hex)), 'ether').toString(),
      to: contractAsset ? ERC20.transfer.decodeInput(txReceipt.data)._to : txReceipt.to,
      nonce: txReceipt.nonce,
      gasLimit: txReceipt.gasLimit, // Hex
      gasPrice: txReceipt.gasPrice, // Hex - wei
      data: txReceipt.data // Hex
    };
  }
  return;
}

export const processFormDataToTx = (formData: IFormikFields): ITxObject => {
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
      gasLimit: inputGasLimitToHex(formData.gasLimitField),
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

export const processFormForEstimateGas = (formData: IFormikFields): IHexStrWeb3Transaction => {
  const asset: Asset = formData.asset;
  const network: Network = formData.network;
  if (asset.type === 'erc20' && asset.contractAddress && asset.decimal) {
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
  } else {
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
  }
};
