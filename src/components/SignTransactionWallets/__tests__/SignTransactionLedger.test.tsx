import React from 'react';

import { simpleRender, waitFor } from 'test-utils';

import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';

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

// Mock out entire u2f lib
jest.mock('@ledgerhq/hw-transport-u2f');
jest.mock('@ledgerhq/hw-app-eth', () => {
  // Must be imported here to prevent issues with jest
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { mockFactory } = require('../__mocks__/ledger');
  return mockFactory('', 3, { v: 10, r: 2, s: 4 });
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

    // Expect signed payload to be the following buffer given the v,r,s
    await waitFor(() =>
      expect(defaultProps.onComplete).toHaveBeenCalledWith(
        Buffer.from([
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
  });
});
