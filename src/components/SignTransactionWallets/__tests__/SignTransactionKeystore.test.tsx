import React from 'react';
import { simpleRender, waitFor, fireEvent } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';
import SignTransaction from '@features/SendAssets/components/SignTransaction';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.KEYSTORE_FILE }
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

jest.mock('ethers', () => {
  return {
    Wallet: {
      fromEncryptedJson: jest.fn().mockImplementation(() =>
        Promise.resolve({
          address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
          sign: jest.fn().mockImplementation(() => Promise.resolve('txhash'))
        })
      )
    },
    utils: {
      getAddress: jest.fn().mockImplementation(() => '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c')
    }
  };
});

describe('SignTransaction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Can handle Keystore signing', async () => {
    const { getByText, container } = getComponent();
    const selector = getHeader(WalletId.KEYSTORE_FILE);
    expect(getByText(selector)).toBeInTheDocument();

    const input = container.querySelector('input[type="file"]');
    const file = new File(['foo'], 'keystore.json', { type: 'application/json' });
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input!);
    const btn = container.querySelector('button[type="submit"]');
    await waitFor(() => expect(btn!.getAttribute('disabled')).toBe(null));
    fireEvent.click(btn!);

    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
  });
});
