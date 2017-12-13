import { customTokens } from 'reducers/customTokens';
import { Token } from 'config/data';
import * as customTokensActions from 'actions/customTokens';

describe('customTokens reducer', () => {
  const token1: Token = {
    address: 'address',
    symbol: 'OMG',
    decimal: 16
  };
  const token2: Token = {
    address: 'address',
    symbol: 'ANT',
    decimal: 16
  };

  it('should handle CUSTOM_TOKEN_ADD', () => {
    expect(customTokens(undefined, customTokensActions.addCustomToken(token1))).toEqual([token1]);
  });

  it('should handle CUSTOM_TOKEN_REMOVE', () => {
    const state1 = customTokens(undefined, customTokensActions.addCustomToken(token1));
    const state2 = customTokens(state1, customTokensActions.addCustomToken(token2));

    expect(customTokens(state2, customTokensActions.removeCustomToken(token2.symbol))).toEqual([
      token1
    ]);
  });
});
