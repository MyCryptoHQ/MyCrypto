import { DeepPartial } from '@reduxjs/toolkit';
import { mockStore, simpleRender } from 'test-utils';

import { fAccounts, fAssets, fDAI, fSettings, fTxHistoryAPI, fTxTypeMetas } from '@fixtures';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { translateRaw } from '@translations';
import { ITxType, ITxValue, TAddress } from '@types';

import RecentTransactionList from './RecentTransactionList';

interface Props {
  txHistory: ITxHistoryApiResponse;
}
/* Test components */
describe('RecentTransactionList', () => {
  const renderComponent = ({ txHistory }: Props) => {
    return simpleRender(<RecentTransactionList accountsList={fAccounts} />, {
      initialState: mockStore({
        storeSlice: {
          txHistory: {
            history: [(txHistory as unknown) as DeepPartial<ITxHistoryApiResponse>],
            txTypeMeta: fTxTypeMetas
          }
        },
        dataStoreState: {
          assets: fAssets,
          settings: fSettings
        }
      })
    });
  };

  test('Can render', () => {
    const { getByText } = renderComponent({ txHistory: fTxHistoryAPI });
    const selector = translateRaw('RECENT_TRANSACTIONS');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render transactions', () => {
    const { getByText } = renderComponent({ txHistory: fTxHistoryAPI });
    const selector = translateRaw('RECENT_TRANSACTIONS_DATE');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can properly interpret tx complex tx type', () => {
    const { getByText } = renderComponent({ txHistory: fTxHistoryAPI });
    const selector = translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
      $platform: translateRaw('UNISWAP_V2'),
      $action: translateRaw('PLATFORM_EXCHANGE')
    });
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can properly display single unknown recieved asset', () => {
    const { getByText } = renderComponent({ txHistory: fTxHistoryAPI });
    // recent transactions panel will add unknown value transfer because txType is an exchange and there is no recieved value transfer
    const selector = translateRaw('GENERIC_BASE_NAME');
    const elem = getByText(selector, { exact: false });
    expect(elem).toBeInTheDocument();
  });

  test('Can properly display single known received base asset', () => {
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        txType: ITxType.UNISWAP_V2_DEPOSIT,
        erc20Transfers: [],
        value: '0xde0b6b3a7640000' as ITxValue
      }
    });
    const selector = fAssets[0].ticker;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });

  test('Can properly display single known received token asset', () => {
    const newERC20Transfer = {
      ...fTxHistoryAPI.erc20Transfers[0],
      to: fTxHistoryAPI.from,
      contractAddress: fDAI.contractAddress as TAddress,
      amount: '0xde0b6b3a7640000'
    };
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        txType: ITxType.STANDARD,
        erc20Transfers: [newERC20Transfer]
      }
    });
    const selector = fDAI.ticker;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });

  test('Can properly display multiple recieved assets', () => {
    const newERC20Transfer = { ...fTxHistoryAPI.erc20Transfers[0], to: fTxHistoryAPI.from };
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        erc20Transfers: [...fTxHistoryAPI.erc20Transfers, newERC20Transfer]
      }
    });
    const selector = `2 ${translateRaw('ASSETS')}`;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });

  test('Can properly display single unknown sent asset', () => {
    const newERC20Transfer = {
      ...fTxHistoryAPI.erc20Transfers[0],
      from: fTxHistoryAPI.from,
      contractAddress: '0x0000000000000000000000000000000000000001' as TAddress,
      amount: '0xde0b6b3a7640000'
    };
    const { getByText } = renderComponent({
      txHistory: { ...fTxHistoryAPI, txType: ITxType.STANDARD, erc20Transfers: [newERC20Transfer] }
    });
    // recent transactions panel will add unknown value transfer because txType is an exchange and there is no recieved value transfer
    const selector = translateRaw('GENERIC_ERC20_NAME');
    const elem = getByText(selector, { exact: false });
    expect(elem).toBeInTheDocument();
  });

  test('Can properly display single known sent asset', () => {
    const newERC20Transfer = {
      ...fTxHistoryAPI.erc20Transfers[0],
      from: fTxHistoryAPI.from,
      contractAddress: fDAI.contractAddress as TAddress,
      amount: '0xde0b6b3a7640000'
    };
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        erc20Transfers: [...fTxHistoryAPI.erc20Transfers, newERC20Transfer]
      }
    });
    const selector = fDAI.ticker;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });
  test('Can properly display multiple known sent assets', () => {
    const newERC20Transfer = {
      ...fTxHistoryAPI.erc20Transfers[0],
      from: fTxHistoryAPI.from,
      contractAddress: fDAI.contractAddress as TAddress,
      amount: '0xde0b6b3a7640000'
    };
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        erc20Transfers: [...fTxHistoryAPI.erc20Transfers, newERC20Transfer, newERC20Transfer]
      }
    });
    const selector = `2 ${translateRaw('ASSETS')}`;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });
  test('Can properly add value field valueTransfer and display when no other value transfers are present', () => {
    const { getByText } = renderComponent({
      txHistory: {
        ...fTxHistoryAPI,
        txType: ITxType.STANDARD,
        value: '0x0' as ITxValue,
        erc20Transfers: []
      }
    });
    const selector = `0.00000 ETH`;
    const elem = getByText(selector, { exact: false });

    expect(elem).toBeInTheDocument();
  });
});
