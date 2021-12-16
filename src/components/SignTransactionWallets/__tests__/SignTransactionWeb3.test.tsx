import { ComponentProps } from 'react';

import { simpleRender, waitFor } from 'test-utils';

import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fApproveErc20TxConfig, fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

// eslint-disable-next-line jest/no-mocks-import
import { mockWindow } from '../../../../jest_config/__mocks__/web3';
import { getHeader } from './helper';

const defaultProps: ComponentProps<typeof SignTransaction> = {
  txConfig: { ...fTxConfig, senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.WEB3 } },
  onComplete: jest.fn()
};

const getComponent = (props = defaultProps) => {
  return simpleRender(<SignTransaction {...props} />);
};

jest.mock('@ethersproject/providers', () => {
  // Must be imported here to prevent issues with jest
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { mockFactory } = require('../../../../jest_config/__mocks__/web3');
  return {
    // MockFactory only mocks Web3, but other providers are instantiated elsewhere, therefore the symbols are required to be there
    ...jest.requireActual('@ethersproject/providers'),
    ...mockFactory('0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c', 3, 'txhash')
  };
});

describe('SignTransactionWallets: Web3', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Can handle Web3 signing', async () => {
    const customWindow = window as CustomWindow;
    // Mock window.ethereum
    mockWindow(customWindow);
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.WEB3);
    expect(getByText(selector)).toBeInTheDocument();
    expect(customWindow.ethereum.enable).toHaveBeenCalled();
    await waitFor(() => expect(customWindow.ethereum.on).toHaveBeenCalled());
    await waitFor(() => expect(defaultProps.onComplete).toHaveBeenCalledWith('txhash'));
  });

  it('Shows contract info if needed', async () => {
    const customWindow = window as CustomWindow;
    // Mock window.ethereum
    mockWindow(customWindow);
    const { getByText } = getComponent({
      ...defaultProps,
      txConfig: {
        ...fApproveErc20TxConfig,
        senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.WEB3 }
      }
    });
    expect(
      getByText(
        translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
          $contractName: translateRaw('UNKNOWN').toLowerCase()
        }),
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});
