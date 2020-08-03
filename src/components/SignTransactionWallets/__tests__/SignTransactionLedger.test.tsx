import React from 'react';
import { simpleRender, waitFor, act } from 'test-utils';

import { fTxConfig, fNetwork } from '@fixtures';
import { WalletId } from '@types';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

import { getHeader } from './helper';

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

// Mock getAddress with bogus public key and valid chain code
const mockGetAddress = jest.fn().mockImplementation(() => ({
  publicKey: defaultProps.txConfig.senderAccount.address,
  chainCode: fNetwork.chainId
}));

// Mock signing result from Ledger device, device only returns v,r,s values - return as a promise to match Ledger API
const mockSign = jest.fn().mockImplementation(() => Promise.resolve({ v: 10, r: 2, s: 4 }));

// Mock out entire u2f lib
jest.mock('@ledgerhq/hw-transport-u2f');
jest.mock('@ledgerhq/hw-app-eth', () => {
  return jest.fn().mockImplementation(() => ({
    getAddress: mockGetAddress,
    signTransaction: mockSign
  }));
});

describe('SignTransactionWallets: Ledger', () => {
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

    // Expect signed payload to be the following buffer given the v,r,s
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
