import { isTransactionFeeHigh, isValidETHRecipientAddress } from '../validators';
import { ResolutionError } from '@unstoppabledomains/resolution';

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

    // Invalid string examples
    expect(isTransactionFeeHigh('-0.001', 300, false, '21000', '20')).toBe(false);
    expect(isTransactionFeeHigh('0.001', 300, false, '21000*', '20')).toBe(false);
    expect(isTransactionFeeHigh('0.001', 300, false, '21000*', '20+')).toBe(false);
    expect(isTransactionFeeHigh('0.001', 300, false, '21000*', '20a')).toBe(false);
  });
});

describe('isValidETHRecipientAddress', () => {
  it('returns true for a valid checksummed address', () => {
    const expected = { success: true };
    const testAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });
  it('returns true for a valid all-lowercase address', () => {
    const expected = { success: true };
    const testAddress = '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });
  it('returns true for a valid all-uppercase address', () => {
    const expected = { success: true };
    const testAddress = '0X4BBEEB066ED09B7AED07BF39EEE0460DFA261520';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });
  it('returns true for a valid ens name', () => {
    const expected = { success: true };
    const testAddress = 'mycryptoid.eth';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });
  it('returns false for an invalid ens name', () => {
    const expected = { success: false };
    const testAddress = 'mycryptoid.ethhhhh';
    const returned = isValidETHRecipientAddress(
      testAddress,
      ('Domain mycryptoid.ethhhh is not supported' as unknown) as ResolutionError
    );
    expect(returned.success).toBe(expected.success);
  });
  it('returns false for an unresolved ens name', () => {
    const expected = { success: false };
    const testAddress = 'mycryptoidd.eth';
    const returned = isValidETHRecipientAddress(
      testAddress,
      ('Domain michaelhahnn.eth is not registered' as unknown) as ResolutionError
    );
    expect(returned.success).toBe(expected.success);
  });
  it('returns false for an invalid checksummed address', () => {
    const expected = { success: false };
    const testAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFA261520';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });

  it('returns false for an invalid too-short address', () => {
    const expected = { success: false };
    const testAddress = '0x4bbeEB066eD09B7AEd07bF39E';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });

  it('returns false for an invalid too-long address', () => {
    const expected = { success: false };
    const testAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa2615200000';
    const returned = isValidETHRecipientAddress(testAddress, undefined);
    expect(returned.success).toBe(expected.success);
  });
});
