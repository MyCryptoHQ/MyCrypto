import { Token } from 'types/network';
import * as customTokensActions from './actions';
import * as customTokensReducer from './reducer';

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
    expect(
      customTokensReducer.customTokensReducer(undefined, customTokensActions.addCustomToken(token1))
    ).toEqual([token1]);
  });

  it('should handle CUSTOM_TOKEN_REMOVE', () => {
    const state1 = customTokensReducer.customTokensReducer(
      undefined,
      customTokensActions.addCustomToken(token1)
    );
    const state2 = customTokensReducer.customTokensReducer(
      state1,
      customTokensActions.addCustomToken(token2)
    );

    expect(
      customTokensReducer.customTokensReducer(
        state2,
        customTokensActions.removeCustomToken(token2.symbol)
      )
    ).toEqual([token1]);
  });
});
