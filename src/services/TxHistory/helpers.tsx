import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { ITxHistoryType } from '@features/Dashboard/types';
import { deriveTxFields, guessERC20Type } from '@helpers';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { Asset, IAccount, ITxReceipt, Network, TxType } from '@types';
import { fromWei, isSameAddress, isVoid, Wei } from '@utils';
import { isSameHash } from '@utils/isSameAddress';

export const makeTxReceipt = (
  tx: ITxHistoryApiResponse,
  network: Network,
  assets: Asset[]
): ITxReceipt => {
  const contractAsset = getAssetByContractAndNetwork(tx.to, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  const value = fromWei(Wei(BigNumber.from(tx.value).toString()), 'ether');

  // Use this for now to improve quality of receipts
  // @todo: Use erc20 transfer array
  const ercType = guessERC20Type(tx.data);
  const { amount, asset } = deriveTxFields(
    ercType,
    tx.data,
    tx.to,
    tx.value,
    baseAsset,
    contractAsset
  );

  return {
    ...tx,
    asset,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    amount,
    data: tx.data,
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
