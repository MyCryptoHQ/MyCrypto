import React from 'react';
import { simpleRender, waitFor } from 'test-utils';

import { fTxConfig, fNetwork } from '@fixtures';
import { WalletId } from '@types';
import { DataContext } from '@services';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

import { getHeader } from './helper';
import { mockWindow } from '../__mocks__/web3';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: { ...fTxConfig, senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.WEB3 } },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(
    <DataContext.Provider value={{ networks: [fNetwork] } as any}>
      <SignTransaction {...defaultProps} />
    </DataContext.Provider>
  );
};

jest.mock('ethers/providers/web3-provider', () => {
  // Must be imported here to prevent issues with jest
  const { mockFactory } = require('../__mocks__/web3');
  return mockFactory('0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c', 3, 'txhash');
});

describe('SignTransactionWallets: Web3', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Web3 signing', async () => {
    const customWindow = window as CustomWindow;
    // Mock window.ethereum
    mockWindow(customWindow);
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.WEB3);
    expect(getByText(selector)).toBeInTheDocument();
    expect(customWindow.ethereum.enable).toBeCalled();
    await waitFor(() => expect(customWindow.ethereum.on).toBeCalled());
    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
  });
});
