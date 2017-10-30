import { wallet, INITIAL_STATE } from 'reducers/wallet';
import * as walletActions from 'actions/wallet';
import Big from 'bignumber.js';

describe('wallet reducer', () => {
  it('should handle WALLET_SET', () => {
    const doSomething = new Promise<string>(resolve => {
      setTimeout(() => resolve('Success'), 1000);
    });

    const walletInstance = {
      getAddress: () => doSomething,
      signRawTransaction: () => doSomething,
      signMessage: () => doSomething
    };

    expect(wallet(undefined, walletActions.setWallet(walletInstance))).toEqual({
      ...INITIAL_STATE,
      inst: walletInstance,
      balance: null,
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
