import { ComponentProps } from 'react';

import { APP_STATE, mockAppState, simpleRender, waitFor } from 'test-utils';

import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fApproveErc20TxConfig, fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

import { getHeader } from './helper';

const defaultProps: ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: {
      ...fTxConfig.senderAccount,
      address: '0x31497f490293cf5a4540b81c9f59910f62519b63',
      wallet: WalletId.GRIDPLUS
    }
  },
  onComplete: jest.fn()
};

const getComponent = (props = defaultProps) => {
  return simpleRender(<SignTransaction {...props} />, {
    initialState: mockAppState({
      networks: APP_STATE.networks,
      connections: {
        wallets: {
          [WalletId.GRIDPLUS]: {
            wallet: WalletId.GRIDPLUS,
            data: { deviceID: 'foo', password: 'bar' }
          }
        }
      }
    })
  });
};

describe('SignTransactionWallets: GridPlus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setTimeout(60000);
  });

  it('Can handle GridPlus signing', async () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.GRIDPLUS);
    expect(getByText(selector)).toBeInTheDocument();

    await waitFor(
      () =>
        expect(defaultProps.onComplete).toHaveBeenCalledWith(
          '0xf8693284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a40008029a0827cfaac70de301d4ced4695979dc7684fb014613b4055eb405d7330e2f6af5ea02a75d8e8afdd32f9097e6c9518bbc3e4748c193ecfcd089a95ec6e7d9674604b'
        ),
      { timeout: 60000 }
    );
  });

  it('Shows an error if signer doesnt match expected address', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      txConfig: {
        ...fTxConfig,
        senderAccount: {
          ...fTxConfig.senderAccount,
          wallet: WalletId.GRIDPLUS
        }
      }
    });
    const selector = getHeader(WalletId.GRIDPLUS);
    expect(getByText(selector)).toBeInTheDocument();

    await waitFor(
      () =>
        expect(
          getByText(
            'This transaction was signed by the incorrect account on your hardware wallet.',
            { exact: false }
          )
        ).toBeInTheDocument(),
      { timeout: 60000 }
    );
  });

  it('Shows contract info if needed', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      txConfig: {
        ...fApproveErc20TxConfig,
        senderAccount: {
          ...fTxConfig.senderAccount,
          wallet: WalletId.GRIDPLUS
        }
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
