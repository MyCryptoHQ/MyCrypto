import { isVoid } from './isVoid';

describe('isVoid()', () => {
  it('identifies an undefined value', () => {
    expect(isVoid(undefined)).toEqual(true);
  });
  it('identifies a null value', () => {
    expect(isVoid(null)).toEqual(true);
  });
  it('identifies an empty array', () => {
    expect(isVoid([])).toEqual(true);
  });
  it('identifies an empty object', () => {
    expect(isVoid({})).toEqual(true);
  });
});
