import React from 'react';

import { Provider } from 'react-redux';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { createStore } from '@store';
import { translateRaw } from '@translations';
import { FormData } from '@types';
import { truncate } from '@utils';

import LedgerDecrypt from './Ledger';

jest.mock('@ledgerhq/hw-transport-u2f');

jest.mock('@config', () => ({
  ...jest.requireActual('@config'),
  LEDGER_DERIVATION_PATHS: [
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

const defaultProps = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  const { store } = createStore(mockAppState({ networks: APP_STATE.networks }) as any);
  return simpleRender(
    <Provider store={store}>
      <LedgerDecrypt {...defaultProps} />
    </Provider>
  );
};

describe('Ledger', () => {
  // @ts-expect-error Bad mock please ignore
  delete window.location;
  // @ts-expect-error Bad mock please ignore
  window.location = Object.assign(new URL('https://example.org'), {
    ancestorOrigins: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn()
  });

  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });

  it('fetches addresses from Ledger and displays them', async () => {
    const { getByText, getByTestId } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_LEDGER_SCAN'), { exact: false });

    fireEvent.click(button);

    await waitFor(() => expect(getByText(translateRaw('MNEMONIC_TITLE'))).toBeInTheDocument());

    const checkbox = getByTestId('switch-checkbox');

    await waitFor(() => expect(checkbox).toBeInTheDocument());

    fireEvent.click(checkbox);

    await waitFor(
      () =>
        expect(
          getByText(truncate('0x31497F490293CF5a4540b81c9F59910F62519b63'))
        ).toBeInTheDocument(),
      { timeout: 10000 }
    );
  });
});
