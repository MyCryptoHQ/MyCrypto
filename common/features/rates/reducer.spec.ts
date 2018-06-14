import { CCResponse } from 'api/rates';
import { fetchCCRatesSucceeded, fetchCCRatesFailed } from './actions';
import { ratesReducer, INITIAL_STATE } from './reducer';

describe('rates reducer', () => {
  it('should handle RATES_FETCH_CC_SUCCEEDED', () => {
    const fakeCCResp: CCResponse = {
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

    expect(ratesReducer(undefined, fetchCCRatesSucceeded(fakeCCResp))).toEqual({
      ...INITIAL_STATE,
      rates: {
        ...INITIAL_STATE.rates,
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(ratesReducer(undefined, fetchCCRatesFailed())).toHaveProperty('ratesError');
  });
});
