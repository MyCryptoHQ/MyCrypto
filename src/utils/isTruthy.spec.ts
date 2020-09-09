import { isTruthy } from './isTruthy';

describe('isTruthy()', () => {
  it('can identify false values', () => {
    expect(isTruthy(false)).toEqual(false);
    expect(isTruthy(undefined)).toEqual(false);
    expect(isTruthy(null)).toEqual(false);
    expect(isTruthy(NaN)).toEqual(false);
    expect(isTruthy('')).toEqual(false);
  });
  it('can truthfull values', () => {
    expect(isTruthy(true)).toEqual(true);
    expect(isTruthy([])).toEqual(true);
    expect(isTruthy({})).toEqual(true);
    expect(isTruthy('Hello')).toEqual(true);
  });
});
