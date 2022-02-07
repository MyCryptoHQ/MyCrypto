import { DeepPartial } from '@reduxjs/toolkit';
import { mockStore, simpleRender } from 'test-utils';

import { fAccounts, fTxHistoryAPI, fTxTypeMetas } from '@fixtures';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { translateRaw } from '@translations';

import RecentTransactionList from './RecentTransactionList';

/* Test components */
describe('RecentTransactionList', () => {
  const renderComponent = () => {
    return simpleRender(<RecentTransactionList accountsList={fAccounts} />, {
      initialState: mockStore({
        storeSlice: {
          txHistory: {
            history: [(fTxHistoryAPI as unknown) as DeepPartial<ITxHistoryApiResponse>],
            txTypeMeta: fTxTypeMetas
          }
        }
      })
    });
  };

  test('Can render', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('RECENT_TRANSACTIONS');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render transactions', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('RECENT_TRANSACTIONS_DATE');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can properly interpret tx complex tx type', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
      $platform: translateRaw('UNISWAP_V2'),
      $action: translateRaw('PLATFORM_EXCHANGE')
    });
    expect(getByText(selector)).toBeInTheDocument();
  });
});
