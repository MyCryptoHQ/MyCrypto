import { Wei } from 'libs/units';
import configuredStore from 'features/store';
import * as walletActions from './actions';
import * as walletReducer from './reducer';

configuredStore.getState();

describe('wallet reducer', () => {
  describe('WALLET_SET', () => {
    const address = '0x123';
    const doSomething = new Promise<string>(resolve => {
      setTimeout(() => resolve('Success'), 10);
    });

    const walletInstance = {
      getAddressString: () => address,
      signRawTransaction: () => doSomething,
      signMessage: () => doSomething
    };

    //@ts-ignore
    expect(walletReducer.walletReducer(undefined, walletActions.setWallet(walletInstance))).toEqual(
      {
        ...walletReducer.INITIAL_STATE,
        inst: walletInstance,
        recentAddresses: [address]
      }
    );
  });

  it('should handle WALLET_RESET', () => {
    expect(walletReducer.walletReducer(undefined, walletActions.resetWallet())).toEqual(
      walletReducer.INITIAL_STATE
    );
  });

  it('should handle WALLET_SET_BALANCE_PENDING', () => {
    expect(walletReducer.walletReducer(undefined, walletActions.setBalancePending())).toEqual({
      ...walletReducer.INITIAL_STATE,
      balance: {
        ...walletReducer.INITIAL_STATE.balance,
        isPending: true
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_FULFILLED', () => {
    const balance = Wei('100');
    expect(
      walletReducer.walletReducer(undefined, walletActions.setBalanceFullfilled(balance))
    ).toEqual({
      ...walletReducer.INITIAL_STATE,
      balance: {
        wei: balance,
        isPending: false
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_REJECTED', () => {
    expect(walletReducer.walletReducer(undefined, walletActions.setBalanceRejected())).toEqual({
      ...walletReducer.INITIAL_STATE,
      balance: {
        ...walletReducer.INITIAL_STATE.balance,
        isPending: false
      }
    });
  });
});
