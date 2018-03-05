import { showNotification } from 'actions/notifications';
import {
  loadBityRatesSucceededSwap,
  loadShapeshiftRatesSucceededSwap,
  loadShapeshiftRatesFailedSwap,
  loadBityRatesFailedSwap
} from 'actions/swap';
import { getAllRates } from 'api/bity';
import { delay } from 'redux-saga';
import { call, cancel, fork, put, race, take, select } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';
import {
  loadBityRates,
  loadShapeshiftRates,
  handleBityRates,
  handleShapeshiftRates,
  SHAPESHIFT_TIMEOUT,
  POLLING_CYCLE
} from 'sagas/swap/rates';
import shapeshift from 'api/shapeshift';
import { TypeKeys } from 'actions/swap/constants';
import { getHasNotifiedRatesFailure } from 'selectors/swap';

describe('loadBityRates*', () => {
  const gen1 = loadBityRates();
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
  const err = { message: 'error' };
  let random: () => number;

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

  it(`should delay for ${POLLING_CYCLE}ms`, () => {
    expect(gen1.next().value).toEqual(call(delay, POLLING_CYCLE));
  });

  it('should handle an exception', () => {
    const errGen = loadBityRates();
    errGen.next();
    expect((errGen as any).throw(err).value).toEqual(select(getHasNotifiedRatesFailure));
    expect(errGen.next(false).value).toEqual(put(showNotification('danger', err.message)));
    expect(errGen.next().value).toEqual(put(loadBityRatesFailedSwap()));
    expect(errGen.next().value).toEqual(call(delay, POLLING_CYCLE));
  });

  it('should not notify on subsequent exceptions', () => {
    const noNotifyErrGen = loadBityRates();
    noNotifyErrGen.next();
    expect((noNotifyErrGen as any).throw(err).value).toEqual(select(getHasNotifiedRatesFailure));
    expect(noNotifyErrGen.next(true).value).toEqual(put(loadBityRatesFailedSwap()));
    expect(noNotifyErrGen.next().value).toEqual(call(delay, POLLING_CYCLE));
  });
});

describe('loadShapeshiftRates*', () => {
  const gen1 = loadShapeshiftRates();

  const apiResponse = {
    ['1SSTANT']: {
      id: '1STANT',
      options: [
        {
          id: '1ST',
          status: 'available',
          image: 'https://shapeshift.io/images/coins/firstblood.png',
          name: 'FirstBlood'
        },
        {
          id: 'ANT',
          status: 'available',
          image: 'https://shapeshift.io/images/coins/aragon.png',
          name: 'Aragon'
        }
      ],
      rate: '0.24707537',
      limit: 5908.29166225,
      min: 7.86382979
    }
  };
  const err = 'error';
  let random: () => number;

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should race shapeshift.getAllRates', () => {
    expect(gen1.next().value).toEqual(
      race({
        tokens: call(shapeshift.getAllRates),
        timeout: call(delay, SHAPESHIFT_TIMEOUT)
      })
    );
  });

  it('should put loadShapeshiftRatesSucceededSwap', () => {
    expect(gen1.next({ tokens: apiResponse }).value).toEqual(
      put(loadShapeshiftRatesSucceededSwap(apiResponse as any))
    );
  });

  it(`should delay for ${POLLING_CYCLE}ms`, () => {
    expect(gen1.next().value).toEqual(call(delay, POLLING_CYCLE));
  });

  it('should handle an exception', () => {
    const errGen = loadShapeshiftRates();
    errGen.next();
    expect((errGen as any).throw(err).value).toEqual(select(getHasNotifiedRatesFailure));
    expect(errGen.next(false).value).toEqual(
      put(
        showNotification(
          'danger',
          'Failed to load swap rates from ShapeShift, please try again later'
        )
      )
    );
    expect(errGen.next().value).toEqual(put(loadShapeshiftRatesFailedSwap()));
  });

  it('should not notify on subsequent exceptions', () => {
    const noNotifyErrGen = loadShapeshiftRates();
    noNotifyErrGen.next();
    expect((noNotifyErrGen as any).throw(err).value).toEqual(select(getHasNotifiedRatesFailure));
    expect(noNotifyErrGen.next(true).value).toEqual(put(loadShapeshiftRatesFailedSwap()));
  });
});

describe('handleBityRates*', () => {
  const gen = handleBityRates();
  const mockTask = createMockTask();

  it('should fork loadBityRates', () => {
    expect(gen.next().value).toEqual(fork(loadBityRates));
  });

  it('should take SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(gen.next(mockTask).value).toEqual(take(TypeKeys.SWAP_STOP_LOAD_BITY_RATES));
  });

  it('should cancel loadBityRatesTask', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('handleShapeshiftRates*', () => {
  const gen = handleShapeshiftRates();
  const mockTask = createMockTask();

  it('should fork loadShapeshiftRates', () => {
    expect(gen.next().value).toEqual(fork(loadShapeshiftRates));
  });

  it('should take SWAP_STOP_LOAD_BITY_RATES', () => {
    expect(gen.next(mockTask).value).toEqual(take(TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES));
  });

  it('should cancel loadShapeShiftRatesTask', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});
