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
  const { mockFactory } = require('../../../../jest_config/__mocks__/ledger');
  return mockFactory('', 3, { v: '0x29', r: '0x2', s: '0x4' });
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

    await waitFor(() =>
      expect(defaultProps.onComplete).toHaveBeenCalledWith(
        '0xe93284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a400080290204'
      )
    );
  });
});
