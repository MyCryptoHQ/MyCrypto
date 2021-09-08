import React from 'react';

import { Provider } from 'react-redux';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';
import TrezorConnect from 'trezor-connect';

import { createStore } from '@store';
import { translateRaw } from '@translations';
import { FormData } from '@types';
import { truncate } from '@utils';

import TrezorDecrypt from './NewTrezor';

jest.mock('@mycrypto/wallets', () => ({
  ...jest.requireActual('@mycrypto/wallets'),
  TREZOR_DERIVATION_PATHS: [
    {
      name: 'Default (ETH)',
      path: "m/44'/60'/0'/0/<account>"
    }
  ]
}));

jest.mock('@mycrypto/eth-scan', () => ({
  ...jest.requireActual('@mycrypto/eth-scan'),
  getEtherBalances: jest.fn().mockResolvedValue({})
}));

const defaultProps: React.ComponentProps<typeof TrezorDecrypt> = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  const { store } = createStore(mockAppState({ networks: APP_STATE.networks }));
  return simpleRender(
    <Provider store={store}>
      <TrezorDecrypt {...defaultProps} />
    </Provider>
  );
};

describe('NewTrezor', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });

  it('fetches addresses from Trezor and displays them', async () => {
    const { getByText, getByTestId } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_TREZOR_SCAN'), { exact: false });

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

  it('shows error message', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_TREZOR_SCAN'), { exact: false });

    (TrezorConnect.ethereumGetAddress as jest.MockedFunction<
      typeof TrezorConnect.ethereumGetAddress
    >).mockRejectedValueOnce(new Error('foo'));

    fireEvent.click(button);

    await waitFor(() => expect(getByText('foo', { exact: false })).toBeInTheDocument());
  });
});
