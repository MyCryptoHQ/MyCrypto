import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { ITxHistoryType } from '@features/Dashboard/types';
import { ITxHistoryApiResponse, ITxHistoryERC20Transfer } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { Asset, IAccount, IFullTxHistoryValueTransfer, ITxReceipt, Network, TxType } from '@types';
import {
  fromTokenBase,
  fromWei,
  generateGenericERC20,
  generateGenericERC721,
  isSameAddress,
  isVoid,
  toWei,
  Wei
} from '@utils';

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
  const transfers: IFullTxHistoryValueTransfer[] = tx.erc20Transfers.map(
    buildTxValueTransfers(network, assets)
  );

  return {
    ...tx,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    data: tx.data,
    valueTransfers: transfers,
    gasPrice: BigNumber.from(tx.gasPrice),
    gasLimit: BigNumber.from(tx.gasLimit),
    gasUsed: !isVoid(tx.gasUsed) ? BigNumber.from(tx.gasUsed!) : undefined,
    value: parseEther(value),
    nonce: BigNumber.from(tx.nonce),
    blockNumber: !isVoid(tx.blockNumber) ? BigNumber.from(tx.blockNumber!).toNumber() : undefined
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  const apiTxsHashMap = convertTxsToHashMap(apiTxs)
  const accountTxsHashMap = convertTxsToHashMap(accountTxs, apiTxsHashMap)
  return Object.values(accountTxsHashMap);
};

export const convertTxsToHashMap = (txs: ITxReceipt[], initialMap?: Record<string, ITxReceipt>) => 
  txs.reduce<Record<string, ITxReceipt>>(
    (acc, cur) => ({
      ...acc,
      [cur.hash.toLowerCase()]: initialMap
        ? { ...acc[cur.hash.toLowerCase()], ...cur }
        : cur
    }),
    initialMap || {}
  );

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

export const buildTxValueTransfers = (network: Network, assets: Asset[]) => (
  transfer: ITxHistoryERC20Transfer
) => {
  const transferAsset = getAssetByContractAndNetwork(transfer.contractAddress, network)(assets);
  const isEmptyAmountField = transfer.amount === '0x';
  // We don't have NFTs in our asset list, so nft's will always have no transfer asset.
  if (!transferAsset) {
    const genericAsset = isEmptyAmountField
      ? generateGenericERC721(transfer.contractAddress, network.chainId.toString(), network.id)
      : generateGenericERC20(transfer.contractAddress, network.chainId.toString(), network.id);

    return {
      to: transfer.to,
      from: transfer.from,
      asset: genericAsset,
      amount: undefined
    };
  }

  if (isEmptyAmountField && transferAsset) {
    return {
      to: transfer.to,
      from: transfer.from,
      asset: transferAsset,
      amount: '0'
    };
  }
  return {
    to: transfer.to,
    from: transfer.from,
    asset: transferAsset,
    amount: isEmptyAmountField
      ? undefined
      : fromTokenBase(toWei(transfer.amount!, 0), transferAsset.decimal)
  };
};
