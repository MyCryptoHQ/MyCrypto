import { normalize } from '@utils';
import { normalizeQuotes } from '@utils/normalize';

describe('normalize', () => {
  it('converts a domain name to a normalized Unicode', () => {
    const data = normalize('xn--s-qfa0g.de');
    expect(data).toBe('süß.de');
  });
});

describe('normalizeQuotes', () => {
  it('replaces curly quotes with regular quotes supported by JSON', () => {
    expect(normalizeQuotes('“foo”: “bar”')).toBe('"foo": "bar"');
  });
});
