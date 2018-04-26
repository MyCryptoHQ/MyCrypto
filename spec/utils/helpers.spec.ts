import { objectContainsObjectKeys, isNewerVersion } from 'utils/helpers';

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

describe('isNewerVersion', () => {
  it('Should return true for newer major version', () => {
    expect(isNewerVersion('1.0.0', '2.0.0')).toBeTruthy();
  });

  it('Should return true for newer minor version', () => {
    expect(isNewerVersion('1.0.0', '1.1.0')).toBeTruthy();
  });

  it('Should return true for newer patch version', () => {
    expect(isNewerVersion('1.0.0', '1.0.1')).toBeTruthy();
  });

  it('Should return false for same version', () => {
    expect(isNewerVersion('1.0.0', '1.0.0')).toBeFalsy();
  });

  it('Should return false for older version', () => {
    expect(isNewerVersion('1.0.1', '1.0.0')).toBeFalsy();
  });

  it('Should return true for newer release candidate', () => {
    expect(isNewerVersion('1.0.0-RC.0', '1.0.0-RC.1')).toBeTruthy();
  });

  it('Should return false for same release candidate', () => {
    expect(isNewerVersion('1.0.0-RC.1', '1.0.0-RC.1')).toBeFalsy();
  });

  it('Should return false for older release candidate', () => {
    expect(isNewerVersion('1.0.0-RC.1', '1.0.0-RC.0')).toBeFalsy();
  });

  it('Should return true for same version, but no release candidate', () => {
    expect(isNewerVersion('1.0.0-RC.999', '1.0.0')).toBeTruthy();
  });

  it('Should return true for newer non-release candidate', () => {
    expect(isNewerVersion('1.0.0-RC.999', '1.0.1')).toBeTruthy();
  });
});
