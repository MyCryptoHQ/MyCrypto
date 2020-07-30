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
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.KEYSTORE_FILE }
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

  test('Can render Keystore signing', () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.KEYSTORE_FILE);
    expect(getByText(selector)).toBeInTheDocument();
  });
});
