import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';
import TrezorConnect from 'trezor-connect';

import { translateRaw } from '@translations';
import { FormData } from '@types';
import { truncate } from '@utils';

import { TrezorDecrypt } from './Trezor';

jest.mock('@mycrypto/eth-scan', () => ({
  ...jest.requireActual('@mycrypto/eth-scan'),
  getEtherBalances: jest.fn().mockResolvedValue({})
}));

const defaultProps: React.ComponentProps<typeof TrezorDecrypt> = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  return simpleRender(<TrezorDecrypt {...defaultProps} />);
};

describe('Trezor', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });

  it('fetches addresses from Trezor and displays them', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
    const button = getByText(translateRaw('ADD_TREZOR_SCAN'), { exact: false });

    fireEvent.click(button);

    await waitFor(() =>
      expect(getByText(translateRaw('DECRYPT_PROMPT_SELECT_ADDRESS'))).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(getByText(truncate('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'))).toBeInTheDocument()
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
