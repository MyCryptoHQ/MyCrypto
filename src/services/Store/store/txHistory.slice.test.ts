import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts, fTxHistoryAPI, fTxTypeMetas } from '@fixtures';
import { MyCryptoApiService } from '@services';
import { HistoryService } from '@services/ApiService/History';

import slice, {
  fetchHistory,
  fetchSchemaMeta,
  initialState,
  setTxTypeMeta,
  txHistorySaga
} from './txHistory.slice';

const reducer = slice.reducer;
const { fetchError, setHistory } = slice.actions;

describe('TxHistorySlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setHistory(): sets history array', () => {
    const actual = reducer(initialState, setHistory([fTxHistoryAPI]));
    const expected = { ...initialState, history: [fTxHistoryAPI] };
    expect(actual).toEqual(expected);
  });

  it('setTxTypeMeta(): sets tx type meta objects', () => {
    const actual = reducer(initialState, setTxTypeMeta(fTxTypeMetas));
    const expected = { ...initialState, txTypeMeta: fTxTypeMetas };
    expect(actual).toEqual(expected);
  });

  it('fetchError(): sets an error', () => {
    const actual = reducer(initialState, fetchError());
    const expected = { ...initialState, error: true };
    expect(actual).toEqual(expected);
  });
});

describe('txHistorySaga()', () => {
  it('fetches tx history based on accounts', () => {
    const ethereumAccounts = fAccounts
      .filter((a) => a.networkId === 'Ethereum')
      .map((a) => a.address);
    return expectSaga(txHistorySaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide([[call(HistoryService.instance.getHistory, ethereumAccounts), [fTxHistoryAPI]]])
      .put(setHistory([fTxHistoryAPI]))
      .dispatch(fetchHistory())
      .silentRun();
  });

  it('fetches tx type schema based on load', () => {
    return expectSaga(txHistorySaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide([[call(MyCryptoApiService.instance.getSchemaMeta), fTxTypeMetas]])
      .put(setTxTypeMeta(fTxTypeMetas))
      .dispatch(fetchSchemaMeta())
      .silentRun();
  });

  it('can sets error if the call fails', () => {
    const error = new Error('error');
    return expectSaga(txHistorySaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide([[call.fn(HistoryService.instance.getHistory), throwError(error)]])
      .put(fetchError())
      .dispatch(fetchHistory())
      .silentRun();
  });

  it('can sets error if the getSchemaMeta fails', () => {
    const error = new Error('error');
    return expectSaga(txHistorySaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide([[call.fn(MyCryptoApiService.instance.getSchemaMeta), throwError(error)]])
      .put(fetchError())
      .dispatch(fetchSchemaMeta())
      .silentRun();
  });
});
