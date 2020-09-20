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
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.PRIVATE_KEY }
  },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(<SignTransaction {...defaultProps} />);
};

jest.mock('ethers', () => {
  // Must be imported here to prevent issues with jest
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
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

    await waitFor(() => expect(defaultProps.onComplete).toHaveBeenCalledWith('txhash'));
  });
});
