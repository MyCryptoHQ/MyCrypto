import React from 'react';

import { simpleRender } from 'test-utils';
import { fAccount, fTransaction, fNetwork } from 'fixtures';

import { default as WalletConnectComponent } from '../WalletConnect';

const defaultProps = {
  senderAccount: fAccount,
  rawTransaction: fTransaction,
  network: fNetwork,
  onSuccess: jest.fn()
};

const getComponent = ({ ...props }: typeof defaultProps) =>
  simpleRender(<WalletConnectComponent {...props} />);

const mockCreateSession = jest.fn().mockResolvedValue('uri');
const mockKillSession = jest.fn();
const mockOn = jest.fn();
jest.mock('@walletconnect/browser', () =>
  jest.fn().mockImplementation(() => ({
    createSession: mockCreateSession,
    killSession: mockKillSession,
    on: mockOn
  }))
);

describe('SignTransactionWallets: WalletConnect', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('It renders', async () => {
    const titleText = /Connect and Unlock/i;
    const footerText = /Here are some troubleshooting/i;

    const { getByText } = getComponent(defaultProps);
    // Check html
    expect(getByText(titleText)).toBeDefined();
    expect(getByText(footerText)).toBeDefined();

    // Ensure service is triggered
    expect(mockCreateSession).toBeCalledTimes(1);
  });
});
