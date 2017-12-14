import { put } from 'redux-saga/effects';
import { reset as resetActionCreator } from 'actions/transaction';
import { resetTransactionState } from 'sagas/transaction/reset';

describe('resetTransactionState*', () => {
  const gen = resetTransactionState();

  it('sould put resetActionCreator', () => {
    expect(gen.next().value).toEqual(put(resetActionCreator()));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});
