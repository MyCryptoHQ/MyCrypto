import { Wei } from 'libs/units';
import configuredStore from 'features/store';
import * as actions from './actions';
import * as reducer from './reducer';

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
    expect(reducer.walletReducer(undefined, actions.setWallet(walletInstance))).toEqual({
      ...reducer.INITIAL_STATE,
      inst: walletInstance,
      recentAddresses: [address]
    });
  });

  it('should handle WALLET_RESET', () => {
    expect(reducer.walletReducer(undefined, actions.resetWallet())).toEqual(reducer.INITIAL_STATE);
  });

  it('should handle WALLET_SET_BALANCE_PENDING', () => {
    expect(reducer.walletReducer(undefined, actions.setBalancePending())).toEqual({
      ...reducer.INITIAL_STATE,
      balance: {
        ...reducer.INITIAL_STATE.balance,
        isPending: true
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_FULFILLED', () => {
    const balance = Wei('100');
    expect(reducer.walletReducer(undefined, actions.setBalanceFullfilled(balance))).toEqual({
      ...reducer.INITIAL_STATE,
      balance: {
        wei: balance,
        isPending: false
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_REJECTED', () => {
    expect(reducer.walletReducer(undefined, actions.setBalanceRejected())).toEqual({
      ...reducer.INITIAL_STATE,
      balance: {
        ...reducer.INITIAL_STATE.balance,
        isPending: false
      }
    });
  });
});
