import { useContext } from 'react';

import { ITxHistoryType } from '@features/Dashboard/types';
import { ITxReceipt, Network } from '@types';
import { isEmpty } from '@vendor';

import { getTxsFromAccount, StoreContext, useAssets, useContacts, useNetworks } from '../Store';
import { deriveTxType, makeTxReceipt, merge } from './helpers';
import { ITxHistoryEntry } from './types';

function useTxHistory() {
  const { accounts, txHistory } = useContext(StoreContext);
  const { assets } = useAssets();
  const { getContactByAddressAndNetworkId } = useContacts();
  const { networks } = useNetworks();

  // Constant for now since we only support mainnet for tx history
  const ethNetwork = networks.find(({ id }) => id === 'Ethereum')!;

  const apiTxs = txHistory ? txHistory.map((tx) => makeTxReceipt(tx, ethNetwork, assets)) : [];

  const accountTxs = getTxsFromAccount(accounts);

  const mergedTxHistory: ITxHistoryEntry[] = merge(apiTxs, accountTxs)
    .map((tx: ITxReceipt) => {
      const network = networks.find(({ id }) => tx.asset.networkId === id) as Network;

      // if Txhistory contains a deleted network ie. MATIC remove from history.
      if (!network) return {} as ITxHistoryEntry;

      const toAddressBookEntry = getContactByAddressAndNetworkId(
        tx.receiverAddress || tx.to,
        network.id
      );
      const fromAddressBookEntry = getContactByAddressAndNetworkId(tx.from, network.id);
      return {
        ...tx,
        timestamp: tx.timestamp || 0,
        txType: deriveTxType(accounts, tx) || ITxHistoryType.UNKNOWN,
        toAddressBookEntry,
        fromAddressBookEntry,
        networkId: network.id
      };
    })
    // Remove eventual empty items from list
    .filter((item) => !isEmpty(item));

  return { txHistory: mergedTxHistory };
}

export default useTxHistory;
