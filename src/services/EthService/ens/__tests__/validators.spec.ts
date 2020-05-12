import { isValidENSName } from '../validators';

describe('isValidENSName', () => {
  const valid = ['bob.eth', 'edouard.eth'];

  const invalid = [
    'edouard' // must contain domain
  ];

  it('returns true if the name is valid', () => {
    valid.forEach((n) => expect(isValidENSName(n)).toBe(true));
  });

  it('returns false if the name is invalid', () => {
    invalid.forEach((n) => expect(isValidENSName(n)).toBe(false));
  });
});
