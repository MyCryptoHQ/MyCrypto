import { isValidETHAddress } from 'v2/services/EthService';
import { NetworkAssets as TOKENS } from './tokens';

describe('Tokens JSON', () => {
  Object.keys(TOKENS).forEach(network => {
    it(`${network} tokens array properly formatted`, () => {
      const tokens = (TOKENS as any)[network];
      const addressCollisionMap: any = {};
      const symbolCollisionMap: any = {};
      const validationErrors: string[] = [];

      tokens.forEach((token: any) => {
        if (!isValidETHAddress(token.address)) {
          validationErrors.push(
            `Token ${token.symbol} has invalid contract address '${token.address}'`
          );
        }
        if (addressCollisionMap[token.address]) {
          validationErrors.push(
            `Token ${token.symbol} has the same address as ${addressCollisionMap[token.address]}`
          );
        }
        if (symbolCollisionMap[token.symbol]) {
          validationErrors.push(
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
          validationErrors.push(`Token ${token.symbol} has invalid decimal '${token.decimal}'`);
        }
        addressCollisionMap[token.address] = token.symbol;
        symbolCollisionMap[token.symbol] = token.address;
      });

      expect(validationErrors.length).toBe(0);
    });
  });
});
