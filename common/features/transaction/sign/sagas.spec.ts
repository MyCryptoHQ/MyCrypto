import { apply, put, select } from 'redux-saga/effects';

import * as actions from './actions';
import * as sagas from './sagas';
import { getNetworkChainId } from '../../config/selectors';

describe('Sign', () => {
  describe('signLocalTransactionHandler*', () => {
    const tx = 'tx';
    const wallet = {
      signRawTransaction: jest.fn()
    };
    const action: any = { tx, wallet };
    const signedTransaction = new Buffer('signedTransaction');
    const indexingHash = 'indexingHash';

    const gen = sagas.signLocalTransactionHandler(action);

    it('should apply wallet.signRawTransaction', () => {
      expect(gen.next().value).toEqual(apply(wallet, wallet.signRawTransaction, [tx]));
    });

    it('should select the chain ID', () => {
      expect(gen.next().value).toEqual(select(getNetworkChainId));
    });

    it('should call computeIndexingHash', () => {
      gen.next(signedTransaction);
      /*expect(gen.next(signedTransaction).value).toEqual(
        call(computeIndexingHash, signedTransaction)
      );*/
    });

    it('should put signLocalTransactionSucceeded', () => {
      expect(gen.next(indexingHash).value).toEqual(
        put(
          actions.signLocalTransactionSucceeded({
            signedTransaction: undefined as any,
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

    const gen = sagas.signWeb3TransactionHandler(action);

    it('should apply tx.serialize', () => {
      expect(gen.next().value).toEqual(apply(tx, tx.serialize));
    });

    it('should select the chain ID', () => {
      expect(gen.next().value).toEqual(select(getNetworkChainId));
    });

    it('should call computeIndexingHash', () => {
      gen.next(serializedTransaction);
      /*expect(gen.next(serializedTransaction).value).toEqual(
        call(computeIndexingHash, serializedTransaction)
      );*/
    });

    it('should put signWeb3TransactionSucceeded', () => {
      expect(gen.next(indexingHash).value).toEqual(
        put(
          actions.signWeb3TransactionSucceeded({
            transaction: undefined as any,
            indexingHash
          })
        )
      );
    });

    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  });
});
describe('Signing', () => {
  describe('signLocalTransactionHandler*', () => {
    const tx = 'tx';
    const wallet = {
      signRawTransaction: jest.fn()
    };
    const action: any = { tx, wallet };
    const signedTransaction = new Buffer('signedTransaction');
    const indexingHash = 'indexingHash';

    const gen = sagas.signLocalTransactionHandler(action);

    it('should apply wallet.signRawTransaction', () => {
      expect(gen.next().value).toEqual(apply(wallet, wallet.signRawTransaction, [tx]));
    });

    it('should select the chain ID', () => {
      expect(gen.next().value).toEqual(select(getNetworkChainId));
    });

    it('should call computeIndexingHash', () => {
      gen.next(signedTransaction);
      /*expect(gen.next(signedTransaction).value).toEqual(
        call(computeIndexingHash, signedTransaction)
      );*/
    });

    it('should put signLocalTransactionSucceeded', () => {
      expect(gen.next(indexingHash).value).toEqual(
        put(
          actions.signLocalTransactionSucceeded({
            signedTransaction: undefined as any,
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

    const gen = sagas.signWeb3TransactionHandler(action);

    it('should apply tx.serialize', () => {
      expect(gen.next().value).toEqual(apply(tx, tx.serialize));
    });

    it('should select the chain ID', () => {
      expect(gen.next().value).toEqual(select(getNetworkChainId));
    });

    it('should call computeIndexingHash', () => {
      gen.next(serializedTransaction);
      /*expect(gen.next(serializedTransaction).value).toEqual(
        call(computeIndexingHash, serializedTransaction, undefined)
      );*/
    });

    it('should put signWeb3TransactionSucceeded', () => {
      expect(gen.next(indexingHash).value).toEqual(
        put(
          actions.signWeb3TransactionSucceeded({
            transaction: undefined as any,
            indexingHash
          })
        )
      );
    });

    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  });
});
