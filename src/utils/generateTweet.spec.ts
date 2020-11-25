import { generateTweet } from './generateTweet';

describe('generateTweet', () => {
  it('generates a new tweet link', () => {
    const result = generateTweet('foo bar baz qux quux quuz corge grault garply waldo fred');
    const expected =
      'https://twitter.com/intent/tweet?text=foo%20bar%20baz%20qux%20quux%20quuz%20corge%20grault%20garply%20waldo%20fred';
    expect(result).toEqual(expected);
  });
});
