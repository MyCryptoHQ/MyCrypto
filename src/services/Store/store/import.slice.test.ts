import { mockStore } from 'test-utils';

import slice, { importRequest, importSuccess, initialState } from './import.slice';

const reducer = slice.reducer;
const { request, success, error } = slice.actions;

describe('ImportSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('request(): sets request to true', () => {
    const actual = reducer(initialState, request());
    const expected = { ...initialState, request: true };
    expect(actual).toEqual(expected);
  });

  it('success(): sets success to true', () => {
    const actual = reducer(initialState, success());
    const expected = { ...initialState, success: true };
    expect(actual).toEqual(expected);
  });

  it('error(): sets error when exists', () => {
    const data = 'error';
    const actual = reducer(initialState, error(data));
    const expected = { ...initialState, error: data };
    expect(actual).toEqual(expected);
  });

  it('importSuccess: selects success status', () => {
    const state = reducer(initialState, success());
    const actual = importSuccess(mockStore({ storeSlice: { [slice.name]: state } }));
    expect(actual).toEqual(true);
  });

  it('importRequest: selects request status', () => {
    const state = reducer(initialState, request());
    const actual = importRequest(mockStore({ storeSlice: { [slice.name]: state } }));
    expect(actual).toEqual(true);
  });
});
