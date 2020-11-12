import { fLocalStorage } from '@fixtures';

import { isValidImport } from './helpers';

describe('isValidImport()', () => {
  it('isValidImport() succeeds under normal circumstances', () => {
    const isValid = isValidImport(JSON.stringify(fLocalStorage), fLocalStorage);
    expect(isValid).toBe(true);
  });

  it('isValidImport() fails with mismatching versions', () => {
    const isValid = () =>
      isValidImport(JSON.stringify({ ...fLocalStorage, version: '0' }), fLocalStorage);
    expect(isValid()).toBe(false);
  });

  it('isValidImport() fails with missing keys', () => {
    const { accounts, ...lsWithoutAccounts } = fLocalStorage;
    const isValid = isValidImport(JSON.stringify(lsWithoutAccounts), fLocalStorage);
    expect(isValid).toBe(false);
  });
});
