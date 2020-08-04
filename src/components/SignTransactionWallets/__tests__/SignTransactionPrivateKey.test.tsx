import React from 'react';
import { simpleRender, fireEvent, waitFor } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

import { getHeader } from './helper';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.PRIVATE_KEY }
  },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(<SignTransaction {...defaultProps} />);
};

jest.mock('ethers', () => {
  // Must be imported here to prevent issues with jest
  const { mockFactory } = require('../__mocks__/privkey');
  return mockFactory('txhash');
});

describe('SignTransactionWallets: PrivateKey', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Private Key signing', async () => {
    const { getByText, container } = getComponent();
    const selector = getHeader(WalletId.PRIVATE_KEY);
    expect(getByText(selector)).toBeInTheDocument();

    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: 'privkey' } });
    fireEvent.click(getByText(translateRaw('DEP_SIGNTX')));

    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
  });
});
