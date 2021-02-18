import { AnyAction } from 'redux';
import { mockAppState } from 'test-utils';

import { fRates } from '@fixtures';

import { getRates, initialState, setRates, default as slice } from './rates.slice';

const reducer = (sliceState: ReturnType<typeof slice.reducer> | undefined, action: AnyAction) => {
  return mockAppState({ [slice.name]: slice.reducer(sliceState, action) });
};

describe('ratesSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(mockAppState({ [slice.name]: expected }));
  });

  it('setRates(): sets rates', () => {
    const rates = fRates;
    const actual = reducer(initialState, setRates(rates));
    expect(getRates(actual)).toEqual(rates);
  });
});
