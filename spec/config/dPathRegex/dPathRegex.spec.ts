import { dPathRegex, whitespaceDPathRegex } from 'config/dPaths';
import { nospaceValid, nospaceInvalid, whitespaceValid, whitespaceInvalid } from './testStrings';

describe('dPath regex', () => {
  it('should match valid strings', () => {
    nospaceValid.forEach(path => {
      expect(dPathRegex.test(path)).toBeTruthy();
    });
  });

  it("shouldn't match invalid strings", () => {
    nospaceInvalid.forEach(path => {
      expect(dPathRegex.test(path)).toBeFalsy();
    });
  });
});

describe('whitespace dPath regex', () => {
  it('should', () => {
    whitespaceValid.forEach(path => {
      expect(whitespaceDPathRegex.test(path)).toBeTruthy();
    });
  });

  it("shouldn't match invalid strings", () => {
    whitespaceInvalid.forEach(path => {
      expect(whitespaceDPathRegex.test(path)).toBeFalsy();
    });
  });
});
