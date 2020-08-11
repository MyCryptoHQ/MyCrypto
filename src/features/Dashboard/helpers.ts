import { StoreAccount, ITxReceipt, Asset } from '@types';
import { isSameAddress } from '@utils';

import { ITxHistoryType, Action } from './types';

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

  return tx.txType as ITxHistoryType;
};

export const filterDashboardActions = (actions: Action[], assets: Asset[]) =>
  actions.filter((action) => {
    const assetFilter = action.assetFilter;
    if (!assetFilter) return true;
    return assets.filter(assetFilter).length > 0;
  });
