import { CCResponse } from 'api/rates';
import rates, { INITIAL_STATE } from './reducers';
import { fetchCCRatesSucceeded, fetchCCRatesFailed } from './actions';

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

    expect(rates(undefined, fetchCCRatesSucceeded(fakeCCResp))).toEqual({
      ...INITIAL_STATE,
      rates: {
        ...INITIAL_STATE.rates,
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(rates(undefined, fetchCCRatesFailed())).toHaveProperty('ratesError');
  });
});
