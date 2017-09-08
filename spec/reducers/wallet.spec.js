import { wallet, INITIAL_STATE } from 'reducers/wallet';
import * as walletActions from 'actions/wallet';
import Big from 'bignumber.js';
import { Ether } from 'libs/units';

describe('wallet reducer', () => {
  it('should return the initial state', () => {
    expect(wallet(undefined, {})).toEqual(INITIAL_STATE);
  });

  it('should handle WALLET_SET', () => {
    const walletInstance = { wallet: true };
    expect(wallet(undefined, walletActions.setWallet(walletInstance))).toEqual({
      ...INITIAL_STATE,
      inst: walletInstance,
      balance: new Ether(0),
      tokens: {}
    });
  });

  it('should handle WALLET_SET_TOKEN_BALANCES', () => {
    const tokenBalances = { OMG: new Big(20) };
    expect(
      wallet(undefined, walletActions.setTokenBalances(tokenBalances))
    ).toEqual({
      ...INITIAL_STATE,
      tokens: tokenBalances
    });
  });
});
