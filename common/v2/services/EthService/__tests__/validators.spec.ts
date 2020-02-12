import { isTransactionFeeHigh } from '../validators';

describe('isTransactionFeeHigh', () => {
  it('return true for cases where transaction fee is high', () => {
    // Check for when fiat value is over $10
    expect(isTransactionFeeHigh('1', 300, false, '21000', '2000')).toBe(true);
    // Check for when fiat value is over $10 also works for ERC20
    expect(isTransactionFeeHigh('100', 300, true, '21000', '2000')).toBe(true);
    // Transaction fee higher than amount sent
    expect(isTransactionFeeHigh('0.001', 300, false, '21000', '200')).toBe(true);
  });

  it('return false for cases where transaction fee isnt high', () => {
    // If amount is zero or very small return false
    expect(isTransactionFeeHigh('0', 300, false, '21000', '20')).toBe(false);
    expect(isTransactionFeeHigh('0.0000001', 300, false, '21000', '20')).toBe(false);
    // Other examples that should result in false
    expect(isTransactionFeeHigh('1', 300, false, '21000', '20')).toBe(false);
    expect(isTransactionFeeHigh('0.001', 300, false, '21000', '20')).toBe(false);
  });
});
