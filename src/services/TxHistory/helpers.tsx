import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { ITxHistoryType } from '@features/Dashboard/types';
import { generateGenericERC20, generateGenericERC721 } from '@features/SendAssets';
import { IFullTxHistoryValueTransfer, ITxHistoryApiResponse } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { Asset, IAccount, ITxReceipt, Network, TxType } from '@types';
import { fromTokenBase, fromWei, isSameAddress, isVoid, toWei, Wei } from '@utils';

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
  const transfers: IFullTxHistoryValueTransfer[] = tx.erc20Transfers.map((transfer) => {
    const transferAsset = getAssetByContractAndNetwork(transfer.contractAddress, network)(assets);
    const isNFTTransfer = transfer.amount == '0x'
    if (!transferAsset) {
      const genericAsset = !isNFTTransfer ? generateGenericERC20(
        transfer.contractAddress,
        network.chainId.toString(),
        network.id
      ) : generateGenericERC721(
        transfer.contractAddress,
        network.chainId.toString(),
        network.id
      );

      return {
        to: transfer.to,
        from: transfer.from,
        asset: genericAsset,
        amount: '',
        isNFTTransfer
      };
    }
    return {
      to: transfer.to,
      from: transfer.from,
      asset: transferAsset,
      amount: !isNFTTransfer ? fromTokenBase(toWei(transfer.amount, 0), transferAsset.decimal) : '0',
      isNFTTransfer
    };
  });
  if (!parseEther(value).isZero()) {
    transfers.push({
      asset: baseAsset,
      to: tx.to,
      from: tx.from,
      amount:value.toString(),
      isNFTTransfer: false
    } as IFullTxHistoryValueTransfer)
  }
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
  // Prioritize Account TX - needs to be more advanced?

  const apiTxsHashMap = apiTxs.reduce((acc, cur) => {
    acc[cur.hash.toLowerCase()] = cur
    return acc
  }, {} as { [key: string]: ITxReceipt })
  const accountTxsHashMap = accountTxs.reduce((acc, cur) => {
    acc[cur.hash.toLowerCase()] = { ...acc[cur.hash.toLowerCase()], ...cur}
    return acc
  }, apiTxsHashMap as { [key: string]: ITxReceipt })
  return Object.values(accountTxsHashMap)
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
