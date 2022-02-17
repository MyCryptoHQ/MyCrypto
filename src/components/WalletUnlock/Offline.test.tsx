import React, { ComponentProps } from 'react';

import { fireEvent } from '@testing-library/react';
import { simpleRender } from 'test-utils';

import { WALLETS_CONFIG } from '@config';
import { AddressOnlyWallet } from '@services';
import { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';

import { OfflineDecrypt } from './Offline';

const defaultProps = {
  wallet: WALLETS_CONFIG[WalletId.OFFLINE],
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = (props: Partial<ComponentProps<typeof OfflineDecrypt>> = {}) => {
  return simpleRender(<OfflineDecrypt {...defaultProps} {...props} />);
};

describe('Offline', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(
      getByText(translateRaw('INPUT_OFFLINE_ADDRESS_LABEL'), { exact: false })
    ).toBeInTheDocument();
  });

  it('validates the address', async () => {
    const fn = jest.fn();
    const { getByTestId, getByText } = getComponent({ onUnlock: fn });

    const selector = getByTestId('selector');
    const input = selector.querySelector('input')!;
    const button = getByText(translateRaw('ACTION_6'));

    fireEvent.click(button);
    expect(fn).not.toHaveBeenCalled();

    fireEvent.click(input);
    input.focus();
    fireEvent.change(input, { target: { value: 'foo' } });
    input.blur();

    fireEvent.click(button);
    expect(fn).not.toHaveBeenCalled();
    expect(getByText(translateRaw('TO_FIELD_ERROR'))).toBeInTheDocument();
  });

  it('calls onUnlock', async () => {
    const fn = jest.fn();
    const { getByTestId, getByText } = getComponent({ onUnlock: fn });

    const selector = getByTestId('selector');
    const input = selector.querySelector('input')!;
    const button = getByText(translateRaw('ACTION_6'));

    fireEvent.click(input);
    input.focus();
    fireEvent.change(input, { target: { value: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' } });
    input.blur();

    fireEvent.click(button);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      new AddressOnlyWallet('0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520', true)
    );
  });
});
