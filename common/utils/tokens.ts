import { Token } from 'types/network';

interface AddressesAndSymbols {
  addresses: { [address: string]: true };
  symbols: { [symbol: string]: true };
}

export function getAddressesAndSymbols(tokenList: any): AddressesAndSymbols {
  return tokenList.reduce(
    (prev: AddressesAndSymbols, next: any) => {
      prev.addresses[next.address] = true;
      prev.symbols[next.symbol] = true;
      return prev;
    },
    {
      addresses: {},
      symbols: {}
    }
  );
}

export function dedupeCustomTokens(networkTokens: Token[], customTokens: Token[]): Token[] {
  if (!customTokens.length) {
    return [];
  }

  // If any tokens have the same symbol or contract address, remove them
  const tokenCollisionMap = networkTokens.reduce<{ [tokenKey: string]: boolean }>((prev, token) => {
    prev[token.symbol] = true;
    prev[token.address] = true;
    return prev;
  }, {});

  return customTokens.filter(token => {
    return !tokenCollisionMap[token.address] && !tokenCollisionMap[token.symbol];
  });
}
