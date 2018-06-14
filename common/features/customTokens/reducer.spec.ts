import { Token } from 'types/network';
import { addCustomToken, removeCustomToken } from './actions';
import { customTokensReducer } from './reducer';

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
    expect(customTokensReducer(undefined, addCustomToken(token1))).toEqual([token1]);
  });

  it('should handle CUSTOM_TOKEN_REMOVE', () => {
    const state1 = customTokensReducer(undefined, addCustomToken(token1));
    const state2 = customTokensReducer(state1, addCustomToken(token2));

    expect(customTokensReducer(state2, removeCustomToken(token2.symbol))).toEqual([token1]);
  });
});
