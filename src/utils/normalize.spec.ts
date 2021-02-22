import { normalize } from '@utils/normalize';

describe('normalize', () => {
  it('converts a domain name to a normalized Unicode', () => {
    const data = normalize('xn--s-qfa0g.de');
    expect(data).toBe('süß.de');
  });
});
