import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { fNetworks, fAccounts, fAccount, fTxReceipt, fContacts, fContracts } from '@fixtures';
import { DataContext, IDataContext } from '@services';

import useTxHistory from './useTxHistory';
import { StoreContext } from '@services/Store';
import { ITxHistoryApiResponse } from '@services/ApiService/History';

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
  it('uses tx history from StoreProvider ', () => {
    const { result } = renderUseTxHistory();
    // @todo: Add fixture and test properly
    expect(result.current.txHistory).toEqual([]);
  });

  it('uses transactions from Account', () => {
    const { result } = renderUseTxHistory({
      accounts: [{ ...fAccount, transactions: [fTxReceipt] }]
    });
    expect(result.current.txHistory.length).toEqual(1);
    // @todo: Test typing more
  });
});
