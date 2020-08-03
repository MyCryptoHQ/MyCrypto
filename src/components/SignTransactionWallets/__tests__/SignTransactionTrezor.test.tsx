import React from 'react';
import { simpleRender, act, waitFor } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

import { getHeader } from './helper';

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

describe('SignTransactionWallets: Trezor', () => {
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
    await waitFor(() =>
      expect(defaultProps.onComplete).toBeCalledWith(
        new Buffer([
          233,
          50,
          132,
          238,
          107,
          40,
          0,
          130,
          82,
          8,
          148,
          144,
          159,
          116,
          255,
          220,
          34,
          53,
          134,
          208,
          211,
          14,
          120,
          1,
          110,
          112,
          123,
          111,
          90,
          69,
          226,
          134,
          90,
          243,
          16,
          122,
          64,
          0,
          128,
          41,
          2,
          4
        ])
      )
    );
    expect(defaultProps.onComplete).toHaveBeenCalledTimes(1);
  });
});
