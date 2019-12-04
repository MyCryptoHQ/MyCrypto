import * as ens from 'libs/ens';

// TODO: write tests for:
// ens.placeBid
// ens.unsealBid
// ens.resolveDomainRequest

describe('ENS', () => {
  it('converts a domain name to a normalized Unicode', () => {
    const data = ens.normalise('xn--s-qfa0g.de');
    expect(data).toBe('süß.de');
  });

  it('converts a string to hexacedimal', () => {
    const unicodeToHash = ens.getNameHash('Süß.de');
    const asciiToHash = ens.getNameHash('xn--s-qfa0g.de');
    expect(unicodeToHash && asciiToHash).toBe(
      '0x26eb2a1d5e19a5d10e4a0001e7f3b22366f27d7203c6985b6b41fe65be107f8b'
    );
  });
});
