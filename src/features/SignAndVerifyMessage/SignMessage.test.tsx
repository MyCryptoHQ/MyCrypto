import { ComponentProps } from 'react';

import { fireEvent, mockStore, simpleRender, waitFor } from 'test-utils';

import { fNetworks } from '@fixtures';
import { WalletId } from '@types';
import { noOp } from '@utils';

// eslint-disable-next-line jest/no-mocks-import
import { mockWindow } from '../../../jest_config/__mocks__/web3';
import SignMessage from './SignMessage';
import slice from './signMessage.slice';

jest.mock('@services/WalletService/walletService', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { Web3Wallet } = require('../../services/WalletService/non-deterministic');
  return {
    WalletFactory: {
      ['WEB3']: {
        init: async () => [new Web3Wallet('0xE8E0F5417B272f2a1C24419bd2cF6B3F584c6b9A', 'Ropsten')]
      }
    },
    getWallet: jest.fn()
  };
});

const defaultProps: ComponentProps<typeof SignMessage> = {
  setShowSubtitle: noOp
};

const renderComponent = (state = {}, props = defaultProps) => {
  return simpleRender(<SignMessage {...props} />, {
    initialState: mockStore({
      storeSlice: { [slice.name]: state },
      dataStoreState: { networks: fNetworks }
    })
  });
};

describe('SignMessage', () => {
  beforeEach(() => {
    // Mock window.ethereum
    const customWindow = window as CustomWindow;
    mockWindow(customWindow);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('it renders WalletList by default', async () => {
    const { getByText } = renderComponent();
    expect(getByText(/Web3/)).toBeDefined();
  });

  test('it displays form after connect', async () => {
    const { getByText, container, getByRole } = renderComponent({ walletId: WalletId.WEB3 });

    fireEvent.click(getByRole('button', { name: /Connect via Web3 Provider/i }));

    expect(getByText(/unlocking/i)).toBeDefined();
    await waitFor(() => expect(getByText(/Sign Message/i)).toBeDefined());

    const input = container.querySelector('textarea')!;
    fireEvent.change(input, { target: { value: 'foo bar' } });
    expect(input.value).toBe('foo bar');
  });
});
