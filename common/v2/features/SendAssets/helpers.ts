import { utils } from 'ethers';

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
  hexWeiToString
} from 'v2/services/EthService';

import { ITxObject, ITxConfig, ITxReceipt, ITxData } from './types';

export function fromStateToTxObject(state: ITxConfig): ITxObject {
  return {
    to: state.to, // @TODO or token address
    value: state.value,
    data: state.data, // @TODO or generate contract call
    gasLimit: state.gasLimit,
    gasPrice: state.gasPrice,
    nonce: state.nonce,
    chainId: state.network.chainId
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

export function fromTxReceiptObj(txReceipt: ITxReceipt): ITxData | undefined {
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
