import { ITxType } from '@types';

import { isTokenMigration } from './helpers';

describe('isTokenMigration', () => {
  it('returns true for token migrations', () => {
    expect(isTokenMigration(ITxType.REP_TOKEN_MIGRATION)).toBe(true);
    expect(isTokenMigration(ITxType.ANT_TOKEN_MIGRATION)).toBe(true);
    expect(isTokenMigration(ITxType.AAVE_TOKEN_MIGRATION)).toBe(true);
  });

  it('returns false for other types', () => {
    expect(isTokenMigration(ITxType.STANDARD)).toBe(false);
    expect(isTokenMigration(ITxType.DEFIZAP)).toBe(false);
  });
});
