import React from 'react';
import { simpleRender, waitFor } from 'test-utils';

import { fTxConfig, fNetwork } from '@fixtures';
import { WalletId } from '@types';
import { NetworkContext } from '@services';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

import { getHeader } from './helper';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: { ...fTxConfig, senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.WEB3 } },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(
    // @ts-ignore
    <NetworkContext.Provider value={{ networks: [fNetwork] }}>
      <SignTransaction {...defaultProps} />
    </NetworkContext.Provider>
  );
};

const mockGetSigner = jest.fn().mockImplementation(() => ({
  getAddress: mockGetAddress,
  sendUncheckedTransaction: mockSend
}));
const mockGetAddress = jest
  .fn()
  .mockImplementation(() => defaultProps.txConfig.senderAccount.address);
const mockGetNetwork = jest
  .fn()
  .mockImplementation(() => ({ chainId: defaultProps.txConfig.network.chainId }));
const mockSend = jest.fn().mockImplementation(() => Promise.resolve('txhash'));
jest.mock('ethers/providers/web3-provider', () => {
  return {
    Web3Provider: jest.fn().mockImplementation(() => ({
      getSigner: mockGetSigner,
      getNetwork: mockGetNetwork
    }))
  };
});

describe('SignTransactionWallets: Web3', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Web3 signing', async () => {
    const customWindow = window as CustomWindow;
    // Mock window.ethereum
    customWindow.ethereum = {
      enable: jest.fn().mockImplementation(() => true),
      on: jest.fn()
    };
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.WEB3);
    expect(getByText(selector)).toBeInTheDocument();
    expect(customWindow.ethereum.enable).toBeCalled();
    await waitFor(() => expect(customWindow.ethereum.on).toBeCalled());
    await waitFor(() => expect(mockGetAddress).toBeCalled());
    await waitFor(() => expect(mockGetNetwork).toBeCalled());
    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
  });
});
