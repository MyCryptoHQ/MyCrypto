import React from 'react';

import EthereumApp from '@ledgerhq/hw-app-eth';
import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { WALLETS_CONFIG } from '@config';
import { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { truncate } from '@utils';

import { HWLegacy } from './HWLegacy';

jest.mock('@ledgerhq/hw-transport-u2f');

jest.mock('@mycrypto/eth-scan', () => ({
  ...jest.requireActual('@mycrypto/eth-scan'),
  getEtherBalances: jest.fn().mockResolvedValue({})
}));

const defaultProps = {
  wallet: WALLETS_CONFIG[WalletId.LEDGER_NANO_S],
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  return simpleRender(<HWLegacy {...defaultProps} />);
};

describe('HWLegacy', () => {
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
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_LEDGER_SCAN'), { exact: false });

    fireEvent.click(button);

    await waitFor(() =>
      expect(getByText(translateRaw('DECRYPT_PROMPT_SELECT_ADDRESS'))).toBeInTheDocument()
    );

    const address = '0x31497F490293CF5a4540b81c9F59910F62519b63';

    await waitFor(() => expect(getByText(truncate(address))).toBeInTheDocument());

    const row = getByText(truncate(address)).parentElement!.parentElement!.parentElement!
      .parentElement!;

    fireEvent.click(row);

    const unlock = getByText(translateRaw('ACTION_6'));

    fireEvent.click(unlock);

    await waitFor(() =>
      expect(defaultProps.onUnlock).toHaveBeenCalledWith(expect.objectContaining({ address }))
    );
  });

  it('shows error message', async () => {
    // @ts-expect-error Not overwriting all functions
    (EthereumApp as jest.MockedClass<typeof EthereumApp>).mockImplementationOnce(() => ({
      getAddress: jest.fn().mockRejectedValue(new Error('foo'))
    }));

    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_LEDGER_SCAN'), { exact: false });

    fireEvent.click(button);

    await waitFor(() => expect(getByText('foo', { exact: false })).toBeInTheDocument());
  });
});
