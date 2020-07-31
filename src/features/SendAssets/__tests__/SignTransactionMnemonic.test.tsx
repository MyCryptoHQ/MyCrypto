import React from 'react';
import { simpleRender, waitFor, fireEvent } from 'test-utils';

import { fTxConfig } from '@fixtures';
import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';

import SignTransaction from '../components/SignTransaction';

const defaultProps: React.ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.MNEMONIC_PHRASE }
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
      fromMnemonic: jest.fn().mockImplementation(() =>
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

  test('Can render Mnemonic Phrase signing', async () => {
    const { getByText, container } = getComponent();
    const selector = getHeader(WalletId.MNEMONIC_PHRASE);
    expect(getByText(selector)).toBeInTheDocument();

    const input = container.querySelector('input');
    fireEvent.click(input!);
    fireEvent.change(input!, { target: { value: 'mnemonicphrase' } });
    fireEvent.click(getByText(translateRaw('DEP_SIGNTX')));

    await waitFor(() => expect(defaultProps.onComplete).toBeCalledWith('txhash'));
  });
});
