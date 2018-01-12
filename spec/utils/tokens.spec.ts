import { dedupeCustomTokens } from 'utils/tokens';

describe('dedupeCustomTokens', () => {
  const networkTokens = [
    {
      address: '0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5',
      symbol: 'REP',
      decimal: 18
    },
    {
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      symbol: 'GNT',
      decimal: 18
    }
  ];

  const DUPLICATE_ADDRESS = {
    address: networkTokens[0].address,
    symbol: 'REP2',
    decimal: 18
  };
  const DUPLICATE_SYMBOL = {
    address: '0x0',
    symbol: networkTokens[1].symbol,
    decimal: 18
  };
  const NONDUPLICATE_CUSTOM = {
    address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
    symbol: 'MEW',
    decimal: 0
  };

  const customTokens = [DUPLICATE_ADDRESS, DUPLICATE_SYMBOL, NONDUPLICATE_CUSTOM];
  const dedupedTokens = dedupeCustomTokens(networkTokens, customTokens);

  it('Should remove duplicate address custom tokens', () => {
    expect(dedupedTokens.includes(DUPLICATE_ADDRESS)).toBeFalsy();
  });

  it('Should remove duplicate symbol custom tokens', () => {
    expect(dedupedTokens.includes(DUPLICATE_SYMBOL)).toBeFalsy();
  });

  it('Should not remove custom tokens that aren’t duplicates', () => {
    expect(dedupedTokens.includes(NONDUPLICATE_CUSTOM)).toBeTruthy();
  });
});
