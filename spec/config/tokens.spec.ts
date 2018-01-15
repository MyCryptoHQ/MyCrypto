import TOKENS from 'config/tokens';
import { isValidETHAddress } from 'libs/validators';

describe('Tokens JSON', () => {
  Object.keys(TOKENS).forEach(network => {
    it(`${network} tokens array properly formatted`, () => {
      const tokens = TOKENS[network];
      const addressCollisionMap = {};
      const symbolCollisionMap = {};

      tokens.forEach(token => {
        if (!isValidETHAddress(token.address)) {
          throw Error(`Token ${token.symbol} has invalid contract address '${token.address}'`);
        }
        if (addressCollisionMap[token.address]) {
          throw Error(
            `Token ${token.symbol} has the same address as ${addressCollisionMap[token.address]}`
          );
        }
        if (symbolCollisionMap[token.symbol]) {
          throw Error(
            `Symbol ${token.symbol} is repeated between tokens at ${token.address} and ${
              symbolCollisionMap[token.symbol]
            }`
          );
        }
        if (
          token.decimal < 0 ||
          token.decimal > 18 ||
          token.decimal === null ||
          token.decimal === undefined
        ) {
          throw Error(`Token ${token.symbol} has invalid decimal '${token.decimal}'`);
        }
        addressCollisionMap[token.address] = token.symbol;
        symbolCollisionMap[token.symbol] = token.address;
      });
    });
  });
});
