import { Token } from 'types/network';
import * as actions from './actions';
import * as reducer from './reducer';

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
    expect(reducer.customTokensReducer(undefined, actions.addCustomToken(token1))).toEqual([
      token1
    ]);
  });

  it('should handle CUSTOM_TOKEN_REMOVE', () => {
    const state1 = reducer.customTokensReducer(undefined, actions.addCustomToken(token1));
    const state2 = reducer.customTokensReducer(state1, actions.addCustomToken(token2));

    expect(reducer.customTokensReducer(state2, actions.removeCustomToken(token2.symbol))).toEqual([
      token1
    ]);
  });
});
