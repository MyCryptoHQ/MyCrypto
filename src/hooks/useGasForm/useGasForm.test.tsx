import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import { fAccount, fNetwork, fTransactionEIP1559 } from '@fixtures';

import { useGasForm } from './useGasForm';

jest.mock('@services/ApiService/Gas', () => ({
  ...jest.requireActual('@services/ApiService/Gas'),
  fetchGasPriceEstimates: jest.fn().mockResolvedValue({ fast: 50 }),
  fetchEIP1559PriceEstimates: jest.fn().mockResolvedValue({
    maxFeePerGas: '200000000000',
    maxPriorityFeePerGas: '3000000000',
    baseFee: '100000000000'
  }),
  getGasEstimate: jest.fn().mockResolvedValue(32000)
}));

const render = () => {
  return renderHook(() => useGasForm({ initialValues: {}, onSubmit: jest.fn() }));
};

describe('useGasForm', () => {
  it('can handleGasPriceEstimation', async () => {
    const { result: r } = render();

    await act(() =>
      r.current.handleGasPriceEstimation({ ...fNetwork, supportsEIP1559: true }, fAccount)
    );

    const values = r.current.values;
    await waitFor(() => expect(values.maxFeePerGasField).toBe('200'));
    expect(values.maxPriorityFeePerGasField).toBe('3');
    expect(r.current.baseFee).toBe('100000000000');
  });

  it('can handleGasPriceEstimation non EIP 1595', async () => {
    const { result: r } = render();

    await act(() =>
      r.current.handleGasPriceEstimation({ ...fNetwork, supportsEIP1559: false }, fAccount)
    );

    const values = r.current.values;
    await waitFor(() => expect(values.gasPriceField).toBe('50'));
  });

  it('can handleGasLimitEstimation', async () => {
    const { result: r } = render();

    await act(() => r.current.handleGasLimitEstimation(fNetwork, fTransactionEIP1559));

    const values = r.current.values;
    await waitFor(() => expect(values.gasLimitField).toBe(32000));
  });
});
