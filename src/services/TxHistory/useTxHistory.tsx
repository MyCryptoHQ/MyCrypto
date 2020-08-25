import { useContext, useState } from 'react';

import { useEffectOnce } from '@vendor';
import { ITxReceipt, Network } from '@types';
import { ITxHistoryType } from '@features/Dashboard/types';

import { StoreContext, getTxsFromAccount, useNetworks, useContacts, useAssets } from '../Store';
import { HistoryService, ITxHistoryApiResponse } from '@services/ApiService/History';
import { deriveTxType } from '@features/Dashboard';
import { makeTxReceipt, merge } from './helpers';
function useTxHistory() {
  const { accounts } = useContext(StoreContext);
  const { assets } = useAssets();
  const { getContactByAddressAndNetworkId } = useContacts();
  const { networks } = useNetworks();
  const [txHistory, setTxHistory] = useState<ITxHistoryApiResponse[] | null>(null);

  useEffectOnce(() => {
    HistoryService.instance.getHistory(accounts.map((a) => a.address)).then((history) => {
      console.log(history);
      if (history !== null) {
        setTxHistory(history);
      }
    });
  });

  // Constant for now since we only support mainnet for tx history
  const ethNetwork = networks.find(({ id }) => id === 'Ethereum')!;

  const apiTxs = txHistory ? txHistory.map((tx) => makeTxReceipt(tx, ethNetwork, assets)) : [];

  const accountTxs = getTxsFromAccount(accounts);

  const mergedTxHistory = merge(apiTxs, accountTxs).map((tx: ITxReceipt) => {
    const network = networks.find(({ id }) => tx.asset.networkId === id) as Network;
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
      network
    };
  });

  return { txHistory: mergedTxHistory };
}

export default useTxHistory;
