import { Token } from 'config/data';

export function dedupeCustomTokens(networkTokens: Token[], customTokens: Token[]): Token[] {
  if (!customTokens.length) {
    return [];
  }

  // If any tokens have the same symbol or contract address, remove them
  const tokenCollisionMap = networkTokens.reduce((prev, token) => {
    prev[token.symbol] = true;
    prev[token.address] = true;
    return prev;
  }, {});

  return customTokens.filter(token => {
    return !tokenCollisionMap[token.address] && !tokenCollisionMap[token.symbol];
  });
}
