import { showNotification } from 'actions/notifications';
import { loadBityRatesSucceededSwap, loadShapeshiftRatesSucceededSwap } from 'actions/swap';
import { getAllRates } from 'api/bity';
import { delay } from 'redux-saga';
import { call, put, race } from 'redux-saga/effects';
import { loadBityRates, loadShapeshiftRates, SHAPESHIFT_TIMEOUT } from 'sagas/swap/rates';
import shapeshift from 'api/shapeshift';

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

describe('loadShapeshiftRates*', () => {
  const gen1 = loadShapeshiftRates();
  const gen2 = loadShapeshiftRates();

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
  let random;

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
      put(loadShapeshiftRatesSucceededSwap(apiResponse))
    );
  });

  it('should call delay for 30 seconds', () => {
    expect(gen1.next().value).toEqual(call(delay, 30000));
  });

  it('should handle an exception', () => {
    const err = 'error';
    gen2.next();
    expect((gen2 as any).throw(err).value).toEqual(
      put(showNotification('danger', `Error loading ShapeShift tokens - ${err}`))
    );
  });
});
