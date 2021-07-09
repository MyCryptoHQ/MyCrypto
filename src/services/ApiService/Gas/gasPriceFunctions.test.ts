import { GAS_PRICE_DEFAULT } from '@config';
import { fNetwork, fNetworks } from '@fixtures';

import { fetchUniversalGasPriceEstimate } from './gasPriceFunctions';

global.fetch = jest.fn().mockResolvedValueOnce({
  status: 200,
  json: jest.fn().mockResolvedValueOnce({
    safeLow: 33,
    standard: 39,
    fast: 42,
    fastest: 58,
    blockNum: 12781209
  })
});

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getFeeData: jest.fn().mockResolvedValue({
        maxFeePerGas: '20000000000',
        maxPriorityFeePerGas: '1000000000'
      })
    }))
  };
});

describe('fetchUniversalGasPriceEstimate', () => {
  it('uses EIP 1559 if possible', () => {
    return expect(
      fetchUniversalGasPriceEstimate({ ...fNetwork, supportsEIP1559: true })
    ).resolves.toStrictEqual({ maxFeePerGas: '20', maxPriorityFeePerGas: '1' });
  });

  it('falls back to gas price endpoint if network doesnt support EIP 1559', () => {
    return expect(
      fetchUniversalGasPriceEstimate({
        ...fNetworks[0],
        supportsEIP1559: false,
        shouldEstimateGasPrice: true
      })
    ).resolves.toStrictEqual({ gasPrice: '42' });
  });

  it('falls back to default gas estimation settings if gas price endpoint fails', () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockRejectedValueOnce(
      new Error('foo')
    );
    return expect(
      fetchUniversalGasPriceEstimate({
        ...fNetworks[0],
        supportsEIP1559: false,
        shouldEstimateGasPrice: true
      })
    ).resolves.toStrictEqual({ gasPrice: fNetworks[0].gasPriceSettings.initial.toString() });
  });

  it('falls back to default gas estimation settings if gas price endpoint not available', () => {
    return expect(
      fetchUniversalGasPriceEstimate({ ...fNetwork, supportsEIP1559: false })
    ).resolves.toStrictEqual({ gasPrice: fNetwork.gasPriceSettings.initial.toString() });
  });

  it('falls back to default gas estimation settings if no network', () => {
    return expect(fetchUniversalGasPriceEstimate()).resolves.toStrictEqual({
      gasPrice: GAS_PRICE_DEFAULT.initial.toString()
    });
  });
});
