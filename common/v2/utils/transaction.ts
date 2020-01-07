import {
  getNetworkByChainId,
  getBaseAssetByNetwork,
  getAssetByContractAndNetwork
} from 'v2/services/Store';
import { ERC20, fromWei, fromTokenBase, Wei, hexWeiToString } from 'v2/services/EthService';
import { ITxReceipt, ExtendedAsset, Network } from 'v2/types';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';

export const fromTxReceiptObj = (txReceipt: ITxReceipt) => (
  assets: ExtendedAsset[],
  networks: Network[]
): ITxReceipt | undefined => {
  const chainId: number = txReceipt.networkId || txReceipt.chainId;
  const networkDetected = getNetworkByChainId(chainId, networks);
  if (networkDetected) {
    const contractAsset = getAssetByContractAndNetwork(txReceipt.to, networkDetected)(assets);
    const baseAsset = getBaseAssetByNetwork({ network: networkDetected, assets });
    return {
      blockNumber: txReceipt.blockNumber,
      network: networkDetected,
      hash: txReceipt.hash,
      from: txReceipt.from,
      asset: contractAsset ? contractAsset : baseAsset ? baseAsset : undefined, // If contractAsset, use contractAsset, else if baseAsset, use baseAsset, else 'undefined'
      value: txReceipt.value.hex, // Hex - wei
      amount: contractAsset
        ? fromTokenBase(
            ERC20.transfer.decodeInput(txReceipt.data)._value,
            contractAsset.decimal || DEFAULT_ASSET_DECIMAL
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
};
