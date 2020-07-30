import React from 'react';
import { simpleRender } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';

import SignTransaction from '../components/SignTransaction';

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

const getHeader = (wallet: WalletId) => {
  return translateRaw('SIGN_TX_TITLE', {
    $walletName: WALLETS_CONFIG[wallet].name
  });
};

describe('SignTransaction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can render Private Key signing', () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.PRIVATE_KEY);
    expect(getByText(selector)).toBeInTheDocument();
  });
});
