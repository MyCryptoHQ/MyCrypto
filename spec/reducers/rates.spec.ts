import { rates, INITIAL_STATE } from 'reducers/rates';
import * as ratesActions from 'actions/rates';

describe('rates reducer', () => {
  it('should handle RATES_FETCH_CC_SUCCEEDED', () => {
    const fakeCCResp: ratesActions.CCResponse = {
      ETH: {
        USD: 0,
        BTC: 1,
        EUR: 2,
        GBP: 3,
        CHF: 4,
        REP: 5,
        ETH: 6
      }
    };

    expect(rates(undefined, ratesActions.fetchCCRatesSucceeded(fakeCCResp))).toEqual({
      ...INITIAL_STATE,
      rates: {
        ...INITIAL_STATE.rates,
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(rates(undefined, ratesActions.fetchCCRatesFailed())).toHaveProperty('ratesError');
  });
});
