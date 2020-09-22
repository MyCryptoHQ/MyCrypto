import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

import { getHeader } from './helper';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.MNEMONIC_PHRASE }
  },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(<SignTransaction {...defaultProps} />);
};

jest.mock('ethers', () => {
  // Must be imported here to prevent issues with jest
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { mockFactory } = require('../__mocks__/mnemonic');
  return mockFactory('0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c', 'txhash');
});

describe('SignTransactionWallets: Mnemonic', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can render Mnemonic Phrase signing', async () => {
    const { getByText, container } = getComponent();
    const selector = getHeader(WalletId.MNEMONIC_PHRASE);
    expect(getByText(selector)).toBeInTheDocument();

    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: 'mnemonicphrase' } });
    fireEvent.click(getByText(translateRaw('DEP_SIGNTX')));

    await waitFor(() => expect(defaultProps.onComplete).toHaveBeenCalledWith('txhash'));
  });
});
