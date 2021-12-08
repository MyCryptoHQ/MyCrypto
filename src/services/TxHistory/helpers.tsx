import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { ITxHistoryType } from '@features/Dashboard/types';
import { generateGenericErc20 } from '@features/SendAssets';
import { IFullTxHistoryValueTransfer, ITxHistoryApiResponse } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { Asset, IAccount, ITxReceipt, Network, TxType } from '@types';
import { fromTokenBase, fromWei, isSameAddress, isVoid, toWei, Wei } from '@utils';
import { isSameHash } from '@utils/isSameAddress';

export const makeTxReceipt = (
  tx: ITxHistoryApiResponse,
  network: Network,
  assets: Asset[]
): ITxReceipt => {
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  const value = fromWei(Wei(BigNumber.from(tx.value).toString()), 'ether');
  const tokenTransfers: IFullTxHistoryValueTransfer[] = tx.erc20Transfers.map((transfer) => {
    const transferAsset = getAssetByContractAndNetwork(transfer.contractAddress, network)(assets)
    if (!transferAsset) {
      const genericAsset = generateGenericErc20(transfer.contractAddress, network.chainId.toString(), network.id)
      return { to: transfer.to, from: transfer.from, asset: genericAsset, amount: fromTokenBase(toWei(transfer.amount, 0), genericAsset.decimal) }
    }
    return { to: transfer.to, from: transfer.from, asset: transferAsset, amount: fromTokenBase(toWei(transfer.amount, 0), transferAsset.decimal) }
  })
  return {
    ...tx,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    data: tx.data,
    erc20Transfers: tokenTransfers,
    gasPrice: BigNumber.from(tx.gasPrice),
    gasLimit: BigNumber.from(tx.gasLimit),
    gasUsed: !isVoid(tx.gasUsed) ? BigNumber.from(tx.gasUsed!) : undefined,
    value: parseEther(value),
    nonce: BigNumber.from(tx.nonce),
    blockNumber: !isVoid(tx.blockNumber) ? BigNumber.from(tx.blockNumber!).toNumber() : undefined
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  // Prioritize Account TX - needs to be more advanced?
  const filteredApiTxs = apiTxs.filter(
    (tx) => !accountTxs.find((a) => isSameHash(a.hash, tx.hash))
  );
  return filteredApiTxs.concat(accountTxs);
};

export const deriveTxType = (
  txTypeMetas: ITxMetaTypes,
  accountsList: IAccount[],
  tx: ITxReceipt
): TxType => {
  const fromAccount =
    tx.from && accountsList.find(({ address }) => isSameAddress(address, tx.from));
  const toAddress = tx.receiverAddress || tx.to;
  const toAccount =
    toAddress && accountsList.find(({ address }) => isSameAddress(address, toAddress));

  const isIncompleteTxType = [ITxHistoryType.STANDARD, ITxHistoryType.UNKNOWN, ''].includes(
    tx.txType
  );
  const isApiTxType = tx.txType in txTypeMetas;
  const isInvalidTxHistoryType = isIncompleteTxType && !isApiTxType;

  if (isInvalidTxHistoryType && isContractInteraction(tx.data)) {
    return ITxHistoryType.CONTRACT_INTERACT as TxType;
  } else if (isInvalidTxHistoryType && toAccount && fromAccount) {
    return ITxHistoryType.TRANSFER as TxType;
  } else if (isInvalidTxHistoryType && !toAccount && fromAccount) {
    return ITxHistoryType.OUTBOUND as TxType;
  } else if (isInvalidTxHistoryType && toAccount && !fromAccount) {
    return ITxHistoryType.INBOUND as TxType;
  }

  return tx.txType as TxType;
};
