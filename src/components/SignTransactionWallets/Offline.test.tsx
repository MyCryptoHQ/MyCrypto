import React, { ComponentProps } from 'react';

import { serialize } from '@ethersproject/transactions';
import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { WALLETS_CONFIG } from '@config';
import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fERC20Web3TxConfigJSON, fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';
import { makeTransaction } from '@utils';

const defaultProps: ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: {
      ...fTxConfig.senderAccount,
      address: '0x31497f490293cf5a4540b81c9f59910f62519b63',
      wallet: WalletId.OFFLINE
    }
  },
  onComplete: jest.fn()
};

const getComponent = (props = defaultProps) => {
  return simpleRender(<SignTransaction {...props} />, {
    initialState: mockAppState({
      networks: APP_STATE.networks
    })
  });
};

describe('SignTransactionOffline', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(
      getByText(translateRaw('SIGN_TX_TITLE', { $walletName: WALLETS_CONFIG.OFFLINE.name }))
    ).toBeInTheDocument();
  });

  it('shows the raw transaction', () => {
    const { getByText } = getComponent();

    const transaction = serialize(makeTransaction(fTxConfig.rawTransaction));
    expect(getByText(transaction)).toBeInTheDocument();
  });

  it('shows the contract information', () => {
    const { getByText } = getComponent({
      txConfig: {
        ...fERC20Web3TxConfigJSON,
        senderAccount: {
          ...fTxConfig.senderAccount,
          address: '0x31497f490293cf5a4540b81c9f59910f62519b63',
          wallet: WalletId.OFFLINE
        }
      },
      onComplete: jest.fn()
    });

    const transaction = serialize(makeTransaction(fERC20Web3TxConfigJSON.rawTransaction));
    expect(getByText(transaction)).toBeInTheDocument();
    expect(
      getByText(
        translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
          $contractName: translateRaw('UNKNOWN')
        }),
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});
