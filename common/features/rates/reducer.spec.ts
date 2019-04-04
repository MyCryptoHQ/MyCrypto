import { CCResponse } from 'api/rates';
import * as actions from './actions';
import * as reducer from './reducer';

describe('rates reducer', () => {
  it('should handle RATES_FETCH_CC_SUCCEEDED', () => {
    const fakeCCResp: CCResponse = {
      ETH: {
        USD: 0,
        BTC: 1,
        EUR: 2,
        GBP: 3,
        CHF: 4,
        ETH: 5,
        RUB: 6,
        JPY: 7,
        KRW: 8,
        INR: 9
      }
    };

    expect(reducer.ratesReducer(undefined, actions.fetchCCRatesSucceeded(fakeCCResp))).toEqual({
      ...reducer.INITIAL_STATE,
      rates: {
        ...reducer.INITIAL_STATE.rates,
        ...fakeCCResp
      }
    });
  });

  it('should handle RATES_FETCH_CC_FAILED', () => {
    expect(reducer.ratesReducer(undefined, actions.fetchCCRatesFailed())).toHaveProperty(
      'ratesError'
    );
  });
});
