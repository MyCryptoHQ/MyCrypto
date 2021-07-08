import React from 'react';

import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fSignedTx, fETHWeb3TxResponse as mockTxResponse } from '@fixtures';
import { translateRaw } from '@translations';

import BroadcastTransactionFlow from './BroadcastTransactionFlow';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      estimateGas: jest.fn().mockResolvedValue(21000),
      getTransactionCount: jest.fn().mockResolvedValue(10),
      getFeeData: jest.fn().mockResolvedValue({
        maxFeePerGas: '20000000000',
        maxPriorityFeePerGas: '1000000000'
      }),
      sendTransaction: jest.fn().mockResolvedValue(mockTxResponse)
    }))
  };
});

function getComponent() {
  return simpleRender(<BroadcastTransactionFlow />, {
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: APP_STATE.networks
    })
  });
}

describe('BroadcastTransactionFlow', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('BROADCAST_TX_TITLE'), { exact: false })).toBeInTheDocument();
  });

  it('can submit form', async () => {
    const { getByText, getAllByText, container } = getComponent();

    fireEvent.change(container.querySelector('textarea')!, {
      target: {
        value: fSignedTx
      }
    });

    fireEvent.click(getAllByText(translateRaw('SEND_TRANS'), { exact: false })[1]);

    await waitFor(() =>
      expect(getByText(translateRaw('CONFIRM_TX_MODAL_TITLE'))).toBeInTheDocument()
    );

    fireEvent.click(getByText(translateRaw('CONFIRM_AND_SEND'), { exact: false }));

    await waitFor(() =>
      expect(getByText(translateRaw('BROADCAST_TX_RECEIPT_TITLE'))).toBeInTheDocument()
    );
  });
});
