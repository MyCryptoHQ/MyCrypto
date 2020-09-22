import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { bigNumberify, parseEther } from 'ethers/utils';

import { DEFAULT_NETWORK } from '@config';
import { ITxHistoryType } from '@features/Dashboard/types';
import {
  fAccount,
  fAccounts,
  fAssets,
  fContacts,
  fContracts,
  fNetwork,
  fNetworks,
  fTxHistoryAPI,
  fTxReceipt
} from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { fromWei, Wei } from '@services/EthService';

import useTxHistory from './useTxHistory';

const renderUseTxHistory = ({
  apiTransactions = [] as ITxHistoryApiResponse[],
  accounts = fAccounts,
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider
      value={
        ({
          addressBook: fContacts,
          contracts: fContracts,
          networks: fNetworks,
          assets: fAssets,
          createActions
        } as any) as IDataContext
      }
    >
      <StoreContext.Provider value={{ accounts, txHistory: apiTransactions } as any}>
        {' '}
        {children}
      </StoreContext.Provider>
    </DataContext.Provider>
  );
  return renderHook(() => useTxHistory(), { wrapper });
};

describe('useTxHistory', () => {
  it('uses tx history from StoreProvider', () => {
    const { result } = renderUseTxHistory({ apiTransactions: [fTxHistoryAPI] });

    expect(result.current.txHistory).toEqual([
      {
        ...fTxHistoryAPI,
        amount: fromWei(Wei(bigNumberify(fTxHistoryAPI.value).toString()), 'ether'),
        asset: fAssets[0],
        baseAsset: fAssets[0],
        fromAddressBookEntry: undefined,
        toAddressBookEntry: undefined,
        receiverAddress: fTxHistoryAPI.recipientAddress,
        nonce: bigNumberify(fTxHistoryAPI.nonce).toString(),
        networkId: DEFAULT_NETWORK,
        blockNumber: bigNumberify(fTxHistoryAPI.blockNumber!).toNumber(),
        gasLimit: bigNumberify(fTxHistoryAPI.gasLimit),
        gasPrice: bigNumberify(fTxHistoryAPI.gasPrice),
        gasUsed: bigNumberify(fTxHistoryAPI.gasUsed || 0),
        value: parseEther(fromWei(Wei(bigNumberify(fTxHistoryAPI.value).toString()), 'ether'))
      }
    ]);
  });

  it('uses transactions from Account', () => {
    const { result } = renderUseTxHistory({
      accounts: [{ ...fAccount, transactions: [fTxReceipt] }]
    });
    expect(result.current.txHistory).toEqual([
      {
        ...fTxReceipt,
        networkId: fNetwork.id,
        timestamp: 0,
        toAddressBookEntry: undefined,
        txType: ITxHistoryType.OUTBOUND,
        fromAddressBookEntry: fContacts[0]
      }
    ]);
  });

  it('merges transactions and prioritizes account txs', () => {
    const { result } = renderUseTxHistory({
      accounts: [
        {
          ...fAccount,
          transactions: [
            {
              ...fTxReceipt,
              hash: '0xbc9a016464ac9d52d29bbe9feec9e5cb7eb3263567a1733650fe8588d426bf40'
            }
          ]
        }
      ],
      apiTransactions: [fTxHistoryAPI]
    });
    expect(result.current.txHistory).toHaveLength(1);
    expect(result.current.txHistory).toEqual([
      {
        ...fTxReceipt,
        hash: '0xbc9a016464ac9d52d29bbe9feec9e5cb7eb3263567a1733650fe8588d426bf40',
        networkId: fNetwork.id,
        timestamp: 0,
        toAddressBookEntry: undefined,
        txType: ITxHistoryType.OUTBOUND,
        fromAddressBookEntry: fContacts[0]
      }
    ]);
  });

  it('merges transactions', () => {
    const { result } = renderUseTxHistory({
      accounts: [
        {
          ...fAccount,
          transactions: [fTxReceipt]
        }
      ],
      apiTransactions: [fTxHistoryAPI]
    });
    expect(result.current.txHistory).toHaveLength(2);
  });
});
