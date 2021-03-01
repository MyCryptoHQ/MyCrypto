import React from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { renderHook } from '@testing-library/react-hooks';
import { mockAppState, ProvidersWrapper } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { ITxHistoryType } from '@features/Dashboard/types';
import {
  fAccount,
  fAccounts,
  fAssets,
  fContacts,
  fNetwork,
  fTxHistoryAPI,
  fTxReceipt
} from '@fixtures';
import { StoreContext } from '@services';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { fromWei, Wei } from '@utils';

import useTxHistory from './useTxHistory';

const renderUseTxHistory = ({
  apiTransactions = [] as ITxHistoryApiResponse[],
  accounts = fAccounts
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <ProvidersWrapper
      initialState={mockAppState({
        addressBook: fContacts,
        assets: fAssets
      })}
    >
      <StoreContext.Provider value={{ accounts, txHistory: apiTransactions } as any}>
        {children}
      </StoreContext.Provider>
    </ProvidersWrapper>
  );
  return renderHook(() => useTxHistory(), { wrapper });
};

describe('useTxHistory', () => {
  it('uses tx history from StoreProvider', () => {
    const { result } = renderUseTxHistory({ apiTransactions: [fTxHistoryAPI] });

    expect(result.current.txHistory).toEqual([
      {
        ...fTxHistoryAPI,
        amount: fromWei(Wei(BigNumber.from(fTxHistoryAPI.value).toString()), 'ether'),
        asset: fAssets[0],
        baseAsset: fAssets[0],
        fromAddressBookEntry: undefined,
        toAddressBookEntry: undefined,
        receiverAddress: fTxHistoryAPI.recipientAddress,
        nonce: BigNumber.from(fTxHistoryAPI.nonce).toString(),
        networkId: DEFAULT_NETWORK,
        blockNumber: BigNumber.from(fTxHistoryAPI.blockNumber!).toNumber(),
        gasLimit: BigNumber.from(fTxHistoryAPI.gasLimit),
        gasPrice: BigNumber.from(fTxHistoryAPI.gasPrice),
        gasUsed: BigNumber.from(fTxHistoryAPI.gasUsed || 0),
        value: parseEther(fromWei(Wei(BigNumber.from(fTxHistoryAPI.value).toString()), 'ether'))
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
