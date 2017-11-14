import { rates, INITIAL_STATE } from 'reducers/rates';
import * as ratesActions from 'actions/rates';

describe('rates reducer', () => {
  it('should handle RATES_FETCH_CC_SUCCEEDED', () => {
    const fakeCCResp = {
      BTC: 1,
      EUR: 2,
      GBP: 3,
      CHF: 4,
      REP: 5
    };
    expect(
      rates(undefined, ratesActions.fetchCCRatesSucceeded(fakeCCResp))
    ).toEqual({
      ...INITIAL_STATE,
      rates: {
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(rates(undefined, ratesActions.fetchCCRatesFailed())).toHaveProperty(
      'ratesError'
    );
  });

  // it('should handle WALLET_SET', () => {
  //   const doSomething = new Promise<string>(resolve => {
  //     setTimeout(() => resolve('Success'), 10);
  //   });

  //   const walletInstance = {
  //     getAddressString: () => doSomething,
  //     signRawTransaction: () => doSomething,
  //     signMessage: () => doSomething
  //   };

  //   expect(wallet(undefined, walletActions.setWallet(walletInstance))).toEqual({
  //     ...INITIAL_STATE,
  //     inst: walletInstance,
  //     balance: null,
  //     tokens: {}
  //   });
  // });
});
