import { normalize } from '@utils';
import { normalizeJson, normalizeQuotes, normalizeSingleQuotes } from '@utils/normalize';

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

describe('normalizeSingleQuotes', () => {
  it('replaces curly single quotes with regular single quotes', () => {
    expect(normalizeSingleQuotes('‘foo’: ‘bar’')).toBe("'foo': 'bar'");
  });
});

describe('normalizeJson', () => {
  it('normalizes quotes in a JSON string if it fails to parse', () => {
    expect(normalizeJson(`{“foo”: “bar”}`)).toStrictEqual({
      foo: 'bar'
    });

    expect(normalizeJson(`{"foo": "bar"}`)).toStrictEqual({
      foo: 'bar'
    });

    expect(() => normalizeJson(`{foo: "bar"}`)).toThrow();
  });
});
