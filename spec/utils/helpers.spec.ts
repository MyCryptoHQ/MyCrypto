import { objectContainsObjectKeys } from 'utils/helpers';

describe('objectContainsObjectKeys', () => {
  it('should return true when object contains all keys of another object', () => {
    const checkingObject = {
      a: 1,
      b: 2,
      c: 3
    };

    const containingObject = {
      a: 1,
      b: 2,
      c: 3,
      d: 4
    };

    expect(objectContainsObjectKeys(checkingObject, containingObject)).toBeTruthy();
  });

  it('should return false when object does not contain all keys of another object', () => {
    const checkingObject = {
      a: 1,
      b: 2,
      c: 3
    };

    const containingObject = {
      a: 1
    };

    expect(objectContainsObjectKeys(checkingObject, containingObject)).toBeFalsy();
  });
});
