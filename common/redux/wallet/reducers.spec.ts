import { Wei } from 'libs/units';
import { configuredStore } from 'redux/store';
import {
  setWallet,
  resetWallet,
  setBalancePending,
  setBalanceFullfilled,
  setBalanceRejected
} from './actions';
import wallet, { INITIAL_STATE } from './reducers';

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
    expect(wallet(undefined, setWallet(walletInstance))).toEqual({
      ...INITIAL_STATE,
      inst: walletInstance,
      recentAddresses: [address]
    });
  });

  it('should handle WALLET_RESET', () => {
    expect(wallet(undefined, resetWallet())).toEqual(INITIAL_STATE);
  });

  it('should handle WALLET_SET_BALANCE_PENDING', () => {
    expect(wallet(undefined, setBalancePending())).toEqual({
      ...INITIAL_STATE,
      balance: {
        ...INITIAL_STATE.balance,
        isPending: true
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_FULFILLED', () => {
    const balance = Wei('100');
    expect(wallet(undefined, setBalanceFullfilled(balance))).toEqual({
      ...INITIAL_STATE,
      balance: {
        wei: balance,
        isPending: false
      }
    });
  });

  it('should handle WALLET_SET_BALANCE_REJECTED', () => {
    expect(wallet(undefined, setBalanceRejected())).toEqual({
      ...INITIAL_STATE,
      balance: {
        ...INITIAL_STATE.balance,
        isPending: false
      }
    });
  });
});
