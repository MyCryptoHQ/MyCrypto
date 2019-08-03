import { utils } from 'ethers';

import { getNetworkByChainId, getBaseAssetByNetwork } from 'v2/services/Store';
import { ITxObject, ITxConfig, IFormikFields, ITxReceipt, ITxData } from './types';
import { gasPriceToBase, fromWei, toWei, fromTokenBase } from 'v2/services/EthService/utils/units';
import { getAssetByContractAndNetwork } from 'v2/services/Store/Asset/helpers';
import { ERC20 } from 'v2/services/EthService/contracts/erc20';

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

export function fromFormikStateToTxObject(formikState: IFormikFields): ITxObject {
  return {
    to: formikState.receiverAddress, // @TODO compose data according to asset type
    value: formikState.amount, // @TODO value depends on asset type
    data: formikState.txDataField, // @TODO compose data according to asset type
    gasLimit: formikState.gasLimitField, // @TODO update with correct value.
    gasPrice: fromWei(gasPriceToBase(parseFloat(formikState.gasPriceField)), 'ether'), // @TODO update with correct value.
    nonce: formikState.nonceField, // @TODO update with correct value.
    chainId: formikState.network.chainId
  };
}

export function decodeTransaction(signedTx: string) {
  const decodedTransaction = utils.parseTransaction(signedTx);
  const gasLimit = utils.bigNumberify(decodedTransaction.gasLimit);
  const gasPriceGwei = fromWei(
    toWei(utils.bigNumberify(decodedTransaction.gasPrice).toString(), 0),
    'gwei'
  );
  const amountToSendWei = utils.bigNumberify(decodedTransaction.value);
  const amountToSendEther = utils.formatEther(amountToSendWei);

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
      asset: !contractAsset ? (!baseAsset ? undefined : baseAsset) : contractAsset, // If contractAsset, use contractAsset, else if baseAsset, use baseAsset, else 'undefined'
      value: txReceipt.value.hex, // Hex - wei
      amount: contractAsset
        ? fromTokenBase(
            ERC20.transfer.decodeInput(txReceipt.data)._value,
            contractAsset.decimal || 18
          )
        : txReceipt.value._hex,
      to: contractAsset ? ERC20.transfer.decodeInput(txReceipt.data)._to : txReceipt.to,
      nonce: txReceipt.nonce,
      gasLimit: txReceipt.gasLimit, // Hex
      gasPrice: txReceipt.gasPrice, // Hex - wei
      data: txReceipt.data // Hex
    };
  }
  return;
}
