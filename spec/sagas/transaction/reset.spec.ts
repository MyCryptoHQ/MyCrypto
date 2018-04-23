import { put, select } from 'redux-saga/effects';
import { resetTransactionSuccessful } from 'actions/transaction';
import { resetTransactionState } from 'sagas/transaction/reset';
import { isContractInteraction } from 'selectors/transaction';

describe('resetTransactionState*', () => {
  const gen = resetTransactionState();

  it('should check if this is a contract interaction tab', () => {
    expect(gen.next().value).toEqual(select(isContractInteraction));
  });
  it('should put resetActionCreator', () => {
    expect(gen.next(false).value).toEqual(
      put(resetTransactionSuccessful({ isContractInteraction: false }))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});
