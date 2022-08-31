import React from 'react';

import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { fNetwork } from '@fixtures';

import GasPriceField from './GasPriceField';

function getComponent(props: React.ComponentProps<typeof GasPriceField>) {
  return simpleRender(<GasPriceField {...props} />);
}

const defaultProps = {
  value: '20',
  name: 'gasPrice',
  onChange: jest.fn(),
  error: undefined
};

describe('GasSelector', () => {
  it('can render', async () => {
    const props = { ...defaultProps };
    const { getByDisplayValue } = getComponent(props);
    await waitFor(() => expect(getByDisplayValue('20')).toBeInTheDocument());
  });

  it('calls onChange when changing gas values', async () => {
    const props = { ...defaultProps, network: { ...fNetwork, supportsEIP1559: false } };
    const { container } = getComponent(props);

    const gasPrice = container.querySelector('input[name="gasPrice"]')!;

    fireEvent.change(gasPrice, { target: { value: '10' } });
    await waitFor(() => expect(defaultProps.onChange).toHaveBeenCalledWith('10'));
  });

  it('limits decimals', async () => {
    const props = { ...defaultProps, network: { ...fNetwork, supportsEIP1559: false } };
    const { container } = getComponent(props);

    const gasPrice = container.querySelector('input[name="gasPrice"]')!;

    fireEvent.change(gasPrice, { target: { value: '20.00000000000000' } });
    await waitFor(() => expect(defaultProps.onChange).toHaveBeenCalledWith('20.000000000'));
  });
});
