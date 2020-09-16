import { fTxConfig } from '@fixtures';

import { calculateReplacementGasPrice } from './helpers';

describe('calculateReplacementGasPrice', () => {
  it('correctly determines tx gas price with high enough fast gas price', () => {
    const fastGasPrice = 500;
    expect(calculateReplacementGasPrice(fTxConfig, fastGasPrice)).toBe(500);
  });

  it('correctly determines tx gas price with too low fast gas price', () => {
    const fastGasPrice = 1;
    expect(calculateReplacementGasPrice(fTxConfig, fastGasPrice)).toBe(4.404);
  });
});
