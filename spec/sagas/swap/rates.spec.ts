import { showNotification } from 'actions/notifications';
import { loadBityRatesSucceededSwap } from 'actions/swap';
import { getAllRates } from 'api/bity';
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';
import { loadBityRates, handleBityRates, getBityRatesSaga } from 'sagas/swap/rates';

describe('loadBityRates*', () => {
  const gen1 = loadBityRates();
  const gen2 = loadBityRates();
  const apiResponse = {
    BTCETH: {
      id: 'BTCETH',
      options: [{ id: 'BTC' }, { id: 'ETH' }],
      rate: 23.27855114
    },
    ETHBTC: {
      id: 'ETHBTC',
      options: [{ id: 'ETH' }, { id: 'BTC' }],
      rate: 0.042958
    }
  };
  let random;

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should call getAllRates', () => {
    expect(gen1.next().value).toEqual(call(getAllRates));
  });

  it('should put loadBityRatesSucceededSwap', () => {
    expect(gen1.next(apiResponse).value).toEqual(put(loadBityRatesSucceededSwap(apiResponse)));
  });

  it('should call delay for 5 seconds', () => {
    expect(gen1.next().value).toEqual(call(delay, 30000));
  });

  it('should handle an exception', () => {
    const err = { message: 'error' };
    gen2.next();
    expect((gen2 as any).throw(err).value).toEqual(put(showNotification('danger', err.message)));
  });
});

describe('handleBityRates*', () => {
  const gen = handleBityRates();
  const mockTask = createMockTask();

  it('should fork loadBityRates', () => {
    expect(gen.next().value).toEqual(fork(loadBityRates));
  });

  it('should take SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(gen.next(mockTask).value).toEqual(take('SWAP_STOP_LOAD_BITY_RATES'));
  });

  it('should cancel loadBityRatesTask', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('getBityRatesSaga*', () => {
  const gen = getBityRatesSaga();

  it('should takeLatest SWAP_LOAD_RATES_REQUESTED', () => {
    expect(gen.next().value).toEqual(takeLatest('SWAP_LOAD_BITY_RATES_REQUESTED', handleBityRates));
  });
});
