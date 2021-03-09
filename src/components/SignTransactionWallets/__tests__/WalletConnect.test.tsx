import React from 'react';

import { simpleRender, waitFor } from 'test-utils';

import { fAccount, fNetwork, fTransaction } from '@fixtures';

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
const mockOn = jest.fn().mockImplementation((type, cb) => {
  if (type === 'connect') {
    cb(undefined, {
      params: [
        {
          accounts: [defaultProps.senderAccount.address],
          chainId: defaultProps.senderAccount.network.chainId
        }
      ]
    });
  }
});
const mockSend = jest.fn().mockImplementation(() => 'txhash');
jest.mock('@walletconnect/browser', () =>
  jest.fn().mockImplementation(() => ({
    createSession: mockCreateSession,
    killSession: mockKillSession,
    on: mockOn,
    sendTransaction: mockSend
  }))
);

describe('SignTransactionWallets: WalletConnect', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('It renders and can sign', async () => {
    const titleText = /Connect and Unlock/i;
    const footerText = /What is WalletConnect/i;

    const { getByText } = getComponent(defaultProps);
    // Check html
    expect(getByText(titleText)).toBeDefined();
    expect(getByText(footerText)).toBeDefined();

    // Ensure service is triggered
    expect(mockCreateSession).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(defaultProps.onSuccess).toHaveBeenCalledWith('txhash'));
    expect(mockSend).toHaveBeenCalled();
  });
});
