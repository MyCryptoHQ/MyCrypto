import { CCResponse } from 'api/rates';
import * as ratesActions from './actions';
import * as ratesReducer from './reducer';

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

    expect(
      ratesReducer.ratesReducer(undefined, ratesActions.fetchCCRatesSucceeded(fakeCCResp))
    ).toEqual({
      ...ratesReducer.INITIAL_STATE,
      rates: {
        ...ratesReducer.INITIAL_STATE.rates,
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(ratesReducer.ratesReducer(undefined, ratesActions.fetchCCRatesFailed())).toHaveProperty(
      'ratesError'
    );
  });
});
