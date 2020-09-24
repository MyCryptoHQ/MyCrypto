import { normalize } from '@utils';

describe('normalize', () => {
  it('converts a domain name to a normalized Unicode', () => {
    const data = normalize('xn--s-qfa0g.de');
    expect(data).toBe('süß.de');
  });
});
