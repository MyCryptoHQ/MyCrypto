import { ComponentProps } from 'react';

import EthereumApp from '@ledgerhq/hw-app-eth';
import { simpleRender, waitFor } from 'test-utils';

import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

import { getHeader } from './helper';

const defaultProps: ComponentProps<typeof SignTransaction> = {
  txConfig: {
    ...fTxConfig,
    senderAccount: {
      ...fTxConfig.senderAccount,
      address: '0x31497f490293cf5a4540b81c9f59910f62519b63',
      wallet: WalletId.LEDGER_NANO_S
    }
  },
  onComplete: jest.fn()
};

const getComponent = () => {
  return simpleRender(<SignTransaction {...defaultProps} />);
};

jest.mock('@ledgerhq/hw-transport-u2f');

describe('SignTransactionWallets: Ledger', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setTimeout(60000);
  });

  it('Can handle Ledger signing', async () => {
    const { getByText } = getComponent();
    const selector = getHeader(WalletId.LEDGER_NANO_S);
    expect(getByText(selector)).toBeInTheDocument();

    await waitFor(
      () =>
        expect(defaultProps.onComplete).toHaveBeenCalledWith(
          '0xf8693284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a40008029a0827cfaac70de301d4ced4695979dc7684fb014613b4055eb405d7330e2f6af5ea02a75d8e8afdd32f9097e6c9518bbc3e4748c193ecfcd089a95ec6e7d9674604b'
        ),
      { timeout: 60000 }
    );
  });

  it('shows error message', async () => {
    // @ts-expect-error Not overwriting all functions
    (EthereumApp as jest.MockedClass<typeof EthereumApp>).mockImplementation(() => ({
      signTransaction: jest.fn().mockRejectedValue(new Error('foo')),
      getAddress: jest.fn().mockResolvedValue({ address: fTxConfig.senderAccount.address })
    }));
    const { getByText } = getComponent();

    await waitFor(
      () =>
        expect(
          getByText(translateRaw('SIGN_TX_HARDWARE_FAILED_1'), { exact: false })
        ).toBeInTheDocument(),
      { timeout: 60000 }
    );
  });
});
