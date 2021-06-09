import { initialState, default as slice } from './tokenScanning.slice';

const reducer = slice.reducer;
const { startTokenScan, finishTokenScan } = slice.actions;

describe('Token Scanning Slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('startTokenScan(): sets scanning state to true', () => {
    const actual = reducer(initialState, startTokenScan);
    const expected = { scanning: true };
    expect(actual).toEqual(expected);
  });

  it('finishTokenScan(): sets scanning state to false', () => {
    const actual = reducer(initialState, finishTokenScan);
    const expected = { scanning: false };
    expect(actual).toEqual(expected);
  });
});
