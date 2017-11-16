import { wallet, INITIAL_STATE } from 'reducers/wallet';
import { Wei, TokenValue } from 'libs/units';
import * as walletActions from 'actions/wallet';

describe('wallet reducer', () => {
  it('should handle WALLET_SET', () => {
    const doSomething = new Promise<string>(resolve => {
      setTimeout(() => resolve('Success'), 10);
    });

    const walletInstance = {
      getAddressString: () => doSomething,
      signRawTransaction: () => doSomething,
      signMessage: () => doSomething
    };

    expect(wallet(undefined, walletActions.setWallet(walletInstance))).toEqual({
      ...INITIAL_STATE,
      inst: walletInstance
    });
  });

  it('should handle WALLET_RESET', () => {
    expect(wallet(undefined, walletActions.resetWallet())).toEqual(
      INITIAL_STATE
    );
  });

  it('should handle WALLET_SET_BALANCE_PENDING', () => {
    expect(wallet(undefined, walletActions.setBalancePending())).toEqual({
      ...INITIAL_STATE,
      balance: {
        ...INITIAL_STATE.balance,
        isPending: true
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_FULFILLED', () => {
    const balance = Wei('100');
    expect(
      wallet(undefined, walletActions.setBalanceFullfilled(balance))
    ).toEqual({
      ...INITIAL_STATE,
      balance: {
        wei: balance,
        isPending: false
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_REJECTED', () => {
    expect(wallet(undefined, walletActions.setBalanceRejected())).toEqual({
      ...INITIAL_STATE,
      balance: {
        ...INITIAL_STATE.balance,
        isPending: false
      }
    });
  });

  it('should handle WALLET_SET_TOKEN_BALANCES', () => {
    const tokenBalances = { OMG: TokenValue('20') };
    expect(
      wallet(undefined, walletActions.setTokenBalances(tokenBalances))
    ).toEqual({
      ...INITIAL_STATE,
      tokens: tokenBalances
    });
  });

  it('should handle WALLET_BROADCAST_TX_REQUESTED', () => {
    const signedTx = '0xdeadbeef';

    // test broadcast where first time seeing transaction
    expect(wallet(undefined, walletActions.broadcastTx(signedTx))).toEqual({
      ...INITIAL_STATE,
      transactions: [
        {
          signedTx,
          isBroadcasting: true,
          successfullyBroadcast: false
        }
      ]
    });
  });

  it('should handle WALLET_BROADCAST_TX_SUCCEEDED', () => {
    const signedTx = '0xdead';
    const txHash = '0xbeef';
    const state = wallet(undefined, walletActions.broadcastTx(signedTx));

    expect(
      wallet(state, walletActions.broadcastTxSucceded(txHash, signedTx))
    ).toEqual({
      ...INITIAL_STATE,
      transactions: [
        {
          signedTx,
          isBroadcasting: false,
          successfullyBroadcast: true
        }
      ]
    });
  });

  it('should handle WALLET_BROADCAST_TX_FAILED', () => {
    const signedTx = '0xdeadbeef';
    const errorMsg = 'Broadcasting failed.';
    const state = wallet(undefined, walletActions.broadcastTx(signedTx));

    expect(
      wallet(state, walletActions.broadCastTxFailed(signedTx, errorMsg))
    ).toEqual({
      ...INITIAL_STATE,
      transactions: [
        {
          signedTx,
          isBroadcasting: false,
          successfullyBroadcast: false
        }
      ]
    });
  });
});
