import React from 'react';
import { simpleRender, waitFor, act } from 'test-utils';

import { fTxConfig, fNetwork } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.LEDGER_NANO_S }
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

const mockGetAddress = jest.fn().mockImplementation(() => ({
  publicKey: defaultProps.txConfig.senderAccount.address,
  chainCode: fNetwork.chainId
}));
const mockSign = jest.fn().mockImplementation(() => Promise.resolve({ v: 10, r: 2, s: 4 }));
jest.mock('@ledgerhq/hw-transport-u2f');
jest.mock('@ledgerhq/hw-app-eth', () => {
  return jest.fn().mockImplementation(() => ({
    getAddress: mockGetAddress,
    signTransaction: mockSign
  }));
});

describe('SignTransaction', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Ledger signing', async () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.LEDGER_NANO_S);
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
          42,
          2,
          4
        ])
      )
    );
    expect(mockGetAddress).toHaveBeenCalled();
    expect(mockSign).toHaveBeenCalled();
  });
});
