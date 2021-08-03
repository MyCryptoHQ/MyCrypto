import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { ITxHistoryType } from '@features/Dashboard/types';
import { deriveTxFields, guessERC20Type } from '@helpers';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { Asset, IAccount, ITxReceipt, ITxType, Network } from '@types';
import { fromWei, isSameAddress, isVoid, Wei } from '@utils';

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
  const filteredApiTxs = apiTxs.filter((tx) => !accountTxs.find((a) => a.hash === tx.hash));
  return filteredApiTxs.concat(accountTxs);
};

// Mapping from TX API types to our current types
const TYPE_MAPPING = { ERC_20_APPROVE: ITxType.APPROVAL } as { [key: string]: ITxHistoryType };

export const deriveTxType = (accountsList: IAccount[], tx: ITxReceipt): ITxHistoryType => {
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

  const mapping = Object.keys(TYPE_MAPPING).find((t) => t === tx.txType);
  if (isInvalidTxHistoryType && mapping) {
    return TYPE_MAPPING[mapping];
  }

  if (isInvalidTxHistoryType && toAccount && fromAccount) {
    return ITxHistoryType.TRANSFER;
  } else if (isInvalidTxHistoryType && !toAccount && fromAccount) {
    return ITxHistoryType.OUTBOUND;
  } else if (isInvalidTxHistoryType && toAccount && !fromAccount) {
    return ITxHistoryType.INBOUND;
  }

  return tx.txType as ITxHistoryType;
};
