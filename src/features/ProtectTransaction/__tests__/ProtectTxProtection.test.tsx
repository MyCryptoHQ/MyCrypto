import React from 'react';
import { simpleRender, fireEvent } from 'test-utils';

import { translateRaw } from '@translations';
import { Fiats } from '@config';
import { bigify } from '@utils';

import { ProtectTxProtectionUI } from '../components/ProtectTxProtection';
import { ProtectTxError } from '..';

const defaultProps: React.ComponentProps<typeof ProtectTxProtectionUI> = {
  error: ProtectTxError.NO_ERROR,
  fiat: Fiats.USD,
  isLoading: false,
  feeAmount: { rate: 250, amount: bigify('0.002'), fee: bigify('0.002') },
  web3Wallet: { isWeb3Wallet: true, name: 'MetaMask' },
  isMyCryptoMember: false,
  onCancel: jest.fn(),
  onProtect: jest.fn()
};

const renderComponent = (props: React.ComponentProps<typeof ProtectTxProtectionUI>) => {
  return simpleRender(<ProtectTxProtectionUI {...props} />);
};

describe('ProtectTxReport', () => {
  test('Can render default state', () => {
    const { getByText } = renderComponent(defaultProps);
    const btn = getByText(translateRaw('PROTECTED_TX_PROTECT_MY_TX'));
    expect(btn).toBeInTheDocument();
    expect(getByText(translateRaw('PROTECTED_TX_FEE'), {})).toBeInTheDocument();
    expect(
      getByText(
        translateRaw('PROTECTED_TX_WEB3_WALLET_DESC', {
          $web3WalletName: defaultProps.web3Wallet.name!
        })
      )
    ).toBeInTheDocument();
  });

  test('Can render without fee', () => {
    const { queryByText } = renderComponent({ ...defaultProps, isMyCryptoMember: true });
    expect(queryByText(translateRaw('PROTECTED_TX_FEE'))).toBeNull();
  });

  test('Can render without web3 warning', () => {
    const { queryByText } = renderComponent({
      ...defaultProps,
      web3Wallet: { isWeb3Wallet: false, name: null }
    });
    expect(queryByText(translateRaw('PROTECTED_TX_WEB3_WALLET_DESC'))).toBeNull();
  });

  test('Can render missing info state', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      error: ProtectTxError.INSUFFICIENT_DATA
    });
    expect(getByText(translateRaw('MISSING_INFORMATION'))).toBeInTheDocument();
  });

  test('Can detect cancel clicks', () => {
    const { getByText, container } = renderComponent(defaultProps);
    fireEvent.click(container.querySelector('svg')!);
    fireEvent.click(getByText(translateRaw('PROTECTED_TX_DONT_PROTECT_MY_TX')));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(2);
  });

  test('Can detect protect click', () => {
    const { container } = renderComponent(defaultProps);
    const btn = container.querySelector('button');
    fireEvent.click(btn!);
    expect(defaultProps.onProtect).toHaveBeenCalled();
  });
});
