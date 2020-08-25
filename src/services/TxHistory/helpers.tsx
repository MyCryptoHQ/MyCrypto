import { bigNumberify, parseEther } from 'ethers/utils';

import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { ITxReceipt, Network, Asset, StoreAccount } from '@types';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services';
import { ITxHistoryType } from '@features/Dashboard/types';
import { isSameAddress } from '@utils';

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
    value: parseEther(tx.value.toString()),
    nonce: tx.nonce.toString()
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  // Prioritize Account TX - needs to be more advanced?
  const filteredApiTxs = apiTxs.filter((tx) => !accountTxs.find((a) => a.hash === tx.hash));
  return filteredApiTxs.concat(accountTxs).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
};

export const deriveTxType = (accountsList: StoreAccount[], tx: ITxReceipt): ITxHistoryType => {
  const fromAccount =
    tx.from && accountsList.find(({ address }) => isSameAddress(address, tx.from));
  const toAddress = tx.receiverAddress || tx.to;
  const toAccount =
    toAddress && accountsList.find(({ address }) => isSameAddress(address, toAddress));

  const isInvalidTxHistoryType =
    !('txType' in tx) ||
    tx.txType === ITxHistoryType.STANDARD ||
    tx.txType === ITxHistoryType.UNKNOWN;

  if (isInvalidTxHistoryType && toAccount && fromAccount) {
    return ITxHistoryType.TRANSFER;
  } else if (isInvalidTxHistoryType && !toAccount && fromAccount) {
    return ITxHistoryType.OUTBOUND;
  } else if (isInvalidTxHistoryType && toAccount && !fromAccount) {
    return ITxHistoryType.INBOUND;
  }

  if (!Object.values(ITxHistoryType).some((t) => t === tx.txType)) {
    // @todo: fix
    return ITxHistoryType.INBOUND;
  }
  return tx.txType as ITxHistoryType;
};
