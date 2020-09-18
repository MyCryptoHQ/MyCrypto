import { isUrl } from './isUrl';

describe('isUrl', () => {
  it('identifies protocol-prefixed localhost url value as valid', () => {
    expect(isUrl('https://localhost:3000')).toBeTruthy();
  });
  it('identifies protocol-prefixed mycrypto.com url value as valid', () => {
    expect(isUrl('https://mycrypto.com')).toBeTruthy();
  });
  it('identifies protocol-prefixed app.mycrypto.com url value as valid', () => {
    expect(isUrl('https://app.mycrypto.com')).toBeTruthy();
  });
  it('identifies localhost url value as invalid', () => {
    expect(isUrl('localhost:3000')).toBeFalsy();
  });
  it('identifies mycrypto.com url value as invalid', () => {
    expect(isUrl('mycrypto.com')).toBeFalsy();
  });
  it('identifies app.mycrypto.com url value as invalid', () => {
    expect(isUrl('mycrypto.com')).toBeFalsy();
  });
  it('identifies empty string as invalid', () => {
    expect(isUrl('')).toBeFalsy();
  });
});
