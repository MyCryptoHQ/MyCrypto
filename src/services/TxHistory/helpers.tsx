import { bigNumberify, parseEther } from 'ethers/utils';

import { ITxHistoryType } from '@features/Dashboard/types';
import { fromWei, getAssetByContractAndNetwork, getBaseAssetByNetwork, Wei } from '@services';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { Asset, ITxReceipt, Network, StoreAccount } from '@types';
import { isSameAddress, isVoid } from '@utils';

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

  const value = fromWei(Wei(bigNumberify(tx.value).toString()), 'ether');
  // @todo: Handle erc20 transfer array

  return {
    ...tx,
    asset: contractAsset || baseAsset!,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    amount: value,
    data: tx.data,
    gasPrice: bigNumberify(tx.gasPrice),
    gasLimit: bigNumberify(tx.gasLimit),
    gasUsed: !isVoid(tx.gasUsed) ? bigNumberify(tx.gasUsed!) : undefined,
    value: parseEther(value),
    nonce: bigNumberify(tx.nonce).toString(),
    blockNumber: !isVoid(tx.blockNumber) ? bigNumberify(tx.blockNumber!).toNumber() : undefined
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  // Prioritize Account TX - needs to be more advanced?
  const filteredApiTxs = apiTxs.filter((tx) => !accountTxs.find((a) => a.hash === tx.hash));
  return filteredApiTxs.concat(accountTxs);
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
    tx.txType === ITxHistoryType.UNKNOWN ||
    !Object.values(ITxHistoryType).some((t) => t === tx.txType);

  if (isInvalidTxHistoryType && toAccount && fromAccount) {
    return ITxHistoryType.TRANSFER;
  } else if (isInvalidTxHistoryType && !toAccount && fromAccount) {
    return ITxHistoryType.OUTBOUND;
  } else if (isInvalidTxHistoryType && toAccount && !fromAccount) {
    return ITxHistoryType.INBOUND;
  }

  return tx.txType as ITxHistoryType;
};
