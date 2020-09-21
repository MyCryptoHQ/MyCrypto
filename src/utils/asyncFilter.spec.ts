import { filterAsync, mapAsync } from './asyncFilter';

describe('mapAsync()', () => {
  it('maps using promise correctly', async () => {
    const result = await mapAsync([1, 2, 3], (n) => Promise.resolve(n * 2));
    expect(result).toStrictEqual([2, 4, 6]);
  });
});

describe('filterAsync()', () => {
  it('filters using promise correctly', async () => {
    const result = await filterAsync([1, 2, 3], (n) => Promise.resolve(n >= 2));
    expect(result).toStrictEqual([2, 3]);
  });
});
