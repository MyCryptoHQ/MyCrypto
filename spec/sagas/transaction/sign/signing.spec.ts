import { put, apply, call } from 'redux-saga/effects';
import { signLocalTransactionSucceeded, signWeb3TransactionSucceeded } from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';
import {
  signLocalTransactionHandler,
  signWeb3TransactionHandler
} from 'sagas/transaction/signing/signing';

describe('signLocalTransactionHandler*', () => {
  const tx = 'tx';
  const wallet = {
    signRawTransaction: jest.fn()
  };
  const action: any = { tx, wallet };
  const signedTransaction = new Buffer('signedTransaction');
  const indexingHash = 'indexingHash';

  const gen = signLocalTransactionHandler(action);

  it('should apply wallet.signRawTransaction', () => {
    expect(gen.next().value).toEqual(apply(wallet, wallet.signRawTransaction, [tx]));
  });

  it('should call computeIndexingHash', () => {
    expect(gen.next(signedTransaction).value).toEqual(call(computeIndexingHash, signedTransaction));
  });

  it('should put signLocalTransactionSucceeded', () => {
    expect(gen.next(indexingHash).value).toEqual(
      put(
        signLocalTransactionSucceeded({
          signedTransaction,
          indexingHash,
          noVerify: false
        })
      )
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('signWeb3TransactionHandler*', () => {
  const tx = {
    serialize: jest.fn
  };
  const action: any = { tx };
  const serializedTransaction = new Buffer('tx');
  const indexingHash = 'indexingHash';

  const gen = signWeb3TransactionHandler(action);

  it('should apply tx.serialize', () => {
    expect(gen.next().value).toEqual(apply(tx, tx.serialize));
  });

  it('should call computeIndexingHash', () => {
    expect(gen.next(serializedTransaction).value).toEqual(
      call(computeIndexingHash, serializedTransaction)
    );
  });

  it('should put signWeb3TransactionSucceeded', () => {
    expect(gen.next(indexingHash).value).toEqual(
      put(
        signWeb3TransactionSucceeded({
          transaction: serializedTransaction,
          indexingHash
        })
      )
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});
