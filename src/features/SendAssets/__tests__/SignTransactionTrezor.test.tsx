import React from 'react';
import { simpleRender, act, waitFor } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';

import SignTransaction from '../components/SignTransaction';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.TREZOR }
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

jest.mock('trezor-connect', () => ({
  manifest: jest.fn(),
  getPublicKey: jest.fn().mockImplementation(() =>
    Promise.resolve({
      payload: {
        publicKey: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
        chainCode: 3
      },
      success: true
    })
  ),
  ethereumSignTransaction: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ payload: { v: 41, r: 2, s: 4 }, success: true }))
}));

describe('SignTransaction', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Trezor signing', async () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.TREZOR);
    expect(getByText(selector)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3001);
    });
    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
    expect(defaultProps.onComplete).toHaveBeenCalledTimes(1);
  });
});
