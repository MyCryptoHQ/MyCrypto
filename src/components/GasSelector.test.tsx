import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { fAccount, fNetwork } from '@fixtures';
import { translateRaw } from '@translations';

import GasSelector from './GasSelector';

jest.mock('@services/ApiService/Gas', () => ({
  getGasEstimate: jest.fn().mockResolvedValue(21000),
  fetchUniversalGasPriceEstimate: jest.fn().mockResolvedValue({ gasPrice: '500' })
}));

jest.mock('@services/EthService', () => ({
  getNonce: jest.fn().mockResolvedValue(5)
}));

function getComponent(props: React.ComponentProps<typeof GasSelector>) {
  return simpleRender(<GasSelector {...props} />);
}

const defaultProps = {
  gasPrice: '30',
  maxFeePerGas: '20',
  maxPriorityFeePerGas: '1',
  nonce: '1',
  gasLimit: '21000',
  account: fAccount,
  estimateGasCallProps: {},
  network: fNetwork,
  setNonce: jest.fn(),
  setGasLimit: jest.fn(),
  setGasPrice: jest.fn()
};

describe('GasSelector', () => {
  it('can render', () => {
    const props = { ...defaultProps };
    const { getByText } = getComponent(props);
    expect(getByText(translateRaw('TRANS_AUTO_GAS_TOGGLE'))).toBeInTheDocument();
  });

  it('renders EIP gas', () => {
    const props = { ...defaultProps, network: { ...fNetwork, supportsEIP1559: true } };
    const { getByText } = getComponent(props);
    expect(getByText(translateRaw('MAX_FEE_PER_GAS'))).toBeInTheDocument();
    expect(getByText(translateRaw('MAX_PRIORITY_FEE'))).toBeInTheDocument();
  });

  it('calls functions when changing gas values', async () => {
    const props = { ...defaultProps, network: { ...fNetwork, supportsEIP1559: false } };
    const { container } = getComponent(props);

    const autoGas = container.querySelector('input[name="autoGasSet"]')!;
    fireEvent.click(autoGas);

    const gasPrice = container.querySelector('input[name="gasPrice"]')!;

    fireEvent.change(gasPrice, { target: { value: '20' } });
    await waitFor(() => expect(defaultProps.setGasPrice).toHaveBeenCalledWith({ gasPrice: '20' }));

    const gasLimit = container.querySelector('input[name="gasLimit"]')!;

    fireEvent.change(gasLimit, { target: { value: '51000' } });
    await waitFor(() => expect(defaultProps.setGasLimit).toHaveBeenCalledWith('51000'));

    const nonce = container.querySelector('input[name="nonce"]')!;

    fireEvent.change(nonce, { target: { value: '5' } });
    await waitFor(() => expect(defaultProps.setNonce).toHaveBeenCalledWith('5'));
  });

  it('calls functions when changing EIP values', async () => {
    const props = { ...defaultProps, network: { ...fNetwork, supportsEIP1559: true } };
    const { container } = getComponent(props);
    const maxFee = container.querySelector('input[name="maxFeePerGas"]')!;

    fireEvent.change(maxFee, { target: { value: '40' } });
    await waitFor(() =>
      expect(defaultProps.setGasPrice).toHaveBeenCalledWith({ maxFeePerGas: '40' })
    );

    const priorityFee = container.querySelector('input[name="maxPriorityFeePerGas"]')!;

    fireEvent.change(priorityFee, { target: { value: '3' } });
    await waitFor(() =>
      expect(defaultProps.setGasPrice).toHaveBeenCalledWith({ maxPriorityFeePerGas: '3' })
    );
  });
});
