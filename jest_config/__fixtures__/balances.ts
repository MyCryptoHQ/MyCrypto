import { Balance, TAddress, TUuid } from '@types';

export const fBalances: Balance[] = [
  {
    id: 'RopstenETH-RopstenETH',
    name: 'RopstenETH',
    ticker: 'RopstenETH',
    uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309' as TUuid,
    amount: '0.000000000000000021',
    fiatValue: '0.000000000000000021',
    accounts: [
      {
        address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
        ticker: 'RopstenETH',
        amount: '0.000000000000000021',
        fiatValue: '0.000000000000000021',
        label: 'WalletConnect Account 1'
      }
    ],
    exchangeRate: '1',
    change: 10.5
  },
  {
    id: 'WrappedETH-WETH',
    name: 'WrappedETH',
    ticker: 'WETH',
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698' as TUuid,
    amount: '0.000000000000000001',
    fiatValue: '0.000000000000000001',
    accounts: [
      {
        address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
        ticker: 'WETH',
        amount: '0.000000000000000001',
        fiatValue: '0.000000000000000001',
        label: 'WalletConnect Account 1'
      }
    ],
    exchangeRate: '1',
    change: 10.5
  },
  {
    id: 'Ether-ETH',
    name: 'Ether',
    ticker: 'ETH',
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702' as TUuid,
    amount: '0.000000000000000001',
    fiatValue: '0.000000000000000001',
    accounts: [
      {
        address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
        ticker: 'ETH',
        amount: '0.000000000000000001',
        fiatValue: '0.000000000000000001',
        label: 'WalletConnect Account 1'
      }
    ],
    exchangeRate: '1',
    change: 10.5
  },
  {
    id: 'GoerliETH-GoerliETH',
    name: 'GoerliETH',
    ticker: 'GoerliETH',
    uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a' as TUuid,
    amount: '0.000000000000000001',
    fiatValue: '0.000000000000000001',
    accounts: [
      {
        address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
        ticker: 'GoerliETH',
        amount: '0.000000000000000001',
        fiatValue: '0.000000000000000001',
        label: 'WalletConnect Account 1'
      }
    ],
    exchangeRate: '1',
    change: 10.5
  }
];
