import { expectSaga, mockAppState } from 'test-utils';

import { fNetworks } from '@fixtures';
import { ProviderHandler } from '@services/EthService';
import { bigify } from '@utils';

import slice, { fetchGas, initialState, setBaseFee } from './gas.slice';

const reducer = slice.reducer;

describe('Gas slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setBaseFee(): sets base fee', () => {
    const baseFee = bigify('20000000000');
    const actual = reducer(initialState, setBaseFee(baseFee));
    const expected = {
      baseFee
    };
    expect(actual).toEqual(expected);
  });
});

describe('fetchGas()', () => {
  it('fetches base fee', () => {
    const baseFee = bigify('20000000000');
    ProviderHandler.prototype.getLatestBlock = jest
      .fn()
      .mockResolvedValue({ baseFeePerGas: baseFee });
    return expectSaga(fetchGas)
      .withState(
        mockAppState({
          networks: fNetworks
        })
      )
      .put(setBaseFee(baseFee))
      .silentRun();
  });
});
