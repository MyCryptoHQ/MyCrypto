import { toFixedIfLarger } from '../../common/utils/formatters';

describe('toFixedIfLarger', () => {
  it('should return same value if decimal isnt longer than default', () => {
    const numExample = 7.002;
    expect(toFixedIfLarger(numExample)).toEqual(String(numExample));
  });

  it('should return shortened value rounded up if decimal is longer than default', () => {
    const numExample = 7.1234567;
    expect(toFixedIfLarger(numExample)).toEqual(String(7.123457));
  });
  it('should return shortened value if decimal is longer than passed fixedSize', () => {
    const numExample = 7.12345678;
    expect(toFixedIfLarger(numExample, 2)).toEqual(String(7.12));
  });
});
