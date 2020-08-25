import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { ITxReceipt, Network, Asset } from '@types';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services';
import { bigNumberify } from 'ethers/utils';

export const makeTxReceipt = (
  tx: ITxHistoryApiResponse,
  network: Network,
  assets: Asset[]
): ITxReceipt => {
  const contractAsset = getAssetByContractAndNetwork(tx.to, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  });

  return {
    ...tx,
    asset: contractAsset || baseAsset!,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    amount: tx.value.toString(),
    data: '0x', // @todo: FIX
    gasPrice: bigNumberify(tx.gasPrice),
    gasLimit: bigNumberify(tx.gasLimit),
    gasUsed: bigNumberify(tx.gasUsed || 0),
    value: bigNumberify(tx.value),
    nonce: tx.nonce.toString()
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  // @todo
  return apiTxs.concat(accountTxs);
};
