import React from 'react';

import { Provider } from 'react-redux';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { createStore } from '@store';
import { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { truncate } from '@utils';

import { GridPlus } from './GridPlus';

jest.mock('@mycrypto/eth-scan', () => ({
  ...jest.requireActual('@mycrypto/eth-scan'),
  getEtherBalances: jest.fn().mockResolvedValue({})
}));

const defaultProps = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  const { store } = createStore(
    mockAppState({
      networks: APP_STATE.networks,
      connections: {
        wallets: {
          [WalletId.GRIDPLUS]: {
            wallet: WalletId.GRIDPLUS,
            data: { deviceID: 'foo', password: 'bar' }
          }
        }
      }
    })
  );

  return simpleRender(
    <Provider store={store}>
      <GridPlus {...defaultProps} />
    </Provider>
  );
};

describe('GridPlus', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
    jest.setTimeout(60000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });

  it('fetches addresses from GridPlus and displays them', async () => {
    const { getByText, getByTestId } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('GRIDPLUS_CONNECT'), { exact: false });

    fireEvent.click(button);

    await waitFor(() => expect(getByText(translateRaw('MNEMONIC_TITLE'))).toBeInTheDocument());

    const checkbox = getByTestId('switch-checkbox');

    await waitFor(() => expect(checkbox).toBeInTheDocument());

    fireEvent.click(checkbox);

    await waitFor(
      () =>
        expect(
          getByText(truncate('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'))
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });
});
