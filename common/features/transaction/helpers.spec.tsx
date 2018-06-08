import React from 'react';
import { SagaIterator } from 'redux-saga';
import { select, call, put, take } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { bufferToHex } from 'ethereumjs-util';

import { computeIndexingHash, makeTransaction } from 'libs/transaction';
import { toTokenBase, Wei } from 'libs/units';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { configuredStore } from 'features/store';
import { getOffline, getNetworkConfig, isNetworkUnit } from 'features/config';
import { isSchedulingEnabled } from 'features/schedule';
import { getWalletInst, getEtherBalance, getTokenBalance } from 'features/wallet';
import { showNotification } from 'features/notifications';
import { TypeKeys as TK } from './types';
import { signTransactionFailed, getFromRequested } from './actions';
import {
  broadcastTransactionFailed,
  broadcastTransactionSucceeded,
  broadcastTransactionQueued
} from './broadcast/actions';
import { resetTransactionRequested } from './fields/actions';
import { getUnit, getDecimalFromUnit } from './selectors';
import { getTransactionStatus } from './broadcast/selectors';
import { getGasLimit, getGasPrice } from './fields/selectors';
import { getWeb3Tx, getSignedTx } from './sign/selectors';

/* tslint:disable */
import './actions';
import './selectors'; //throws if not imported
/* tslint:enable */

import {
  rebaseUserInput,
  validateInput,
  makeCostCalculationTx,
  broadcastTransactionWrapper,
  getSerializedTxAndIndexingHash,
  shouldBroadcastTransaction,
  signTransactionWrapper,
  getWalletAndTransaction,
  handleFailedTransaction,
  getFromSaga
} from './helpers';

configuredStore.getState();

describe('transaction: Helpers', () => {
  describe('Broadcast', () => {
    describe('broadcastTransactionWrapper*', () => {
      const indexingHash = 'indexingHash';
      const serializedTransaction = new Buffer('serializedTransaction');
      const shouldBroadcast = true;
      const stringTx = 'stringTx';
      const broadcastedHash: any = 'broadcastedHash';
      const network: any = {
        blockExplorer: 'blockExplorer'
      };

      let random: () => number;
      const func: any = () => undefined;
      const action: any = {};
      const gens: any = {};
      gens.gen = cloneableGenerator(broadcastTransactionWrapper(func))(action);

      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should call getSerializedTxAndIndexingHash with action', () => {
        expect(gens.gen.next().value).toEqual(call(getSerializedTxAndIndexingHash, action));
      });

      it('should call shouldBroadcastTransaction with indexingHash', () => {
        expect(
          gens.gen.next({
            indexingHash,
            serializedTransaction
          }).value
        ).toEqual(call(shouldBroadcastTransaction, indexingHash));
      });

      it('should handle exceptions', () => {
        gens.clone1 = gens.gen.clone();
        const error = { message: 'message' };
        expect(gens.clone1.throw(error).value).toEqual(
          put(broadcastTransactionFailed({ indexingHash }))
        );
        expect(gens.clone1.next().value).toEqual(put(showNotification('danger', error.message)));
        expect(gens.clone1.next().done).toEqual(true);
      });

      it('should put showNotification & reset if !shouldBroadcast', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.clone2.next().value).toEqual(
          put(
            showNotification(
              'warning',
              'TxHash identical: This transaction has already been broadcasted or is broadcasting'
            )
          )
        );
        expect(gens.clone2.next().value).toEqual(put(resetTransactionRequested()));
        expect(gens.clone2.next(!shouldBroadcast).done).toEqual(true);
      });

      it('should put broadcastTransactionQueued', () => {
        expect(gens.gen.next(shouldBroadcast).value).toEqual(
          put(
            broadcastTransactionQueued({
              indexingHash,
              serializedTransaction
            })
          )
        );
      });

      it('should call bufferToHex with serializedTransactioin', () => {
        expect(gens.gen.next().value).toEqual(call(bufferToHex, serializedTransaction));
      });

      it('should call func with stringTx', () => {
        expect(gens.gen.next(stringTx).value).toEqual(call(func, stringTx));
      });

      it('should put broadcastTransactionSucceeded', () => {
        expect(gens.gen.next(broadcastedHash).value).toEqual(
          put(
            broadcastTransactionSucceeded({
              indexingHash,
              broadcastedHash
            })
          )
        );
      });

      it('select getNetworkConfig', () => {
        expect(gens.gen.next().value).toEqual(select(getNetworkConfig));
      });

      it('select isSchedulingEnabled', () => {
        expect(gens.gen.next(network).value).toEqual(select(isSchedulingEnabled));
      });

      it('should put showNotification', () => {
        expect(gens.gen.next(false).value).toEqual(
          put(
            showNotification(
              'success',
              <TransactionSucceeded
                txHash={broadcastedHash}
                blockExplorer={network.blockExplorer}
                scheduling={false}
              />,
              Infinity
            )
          )
        );
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });

    describe('shouldBroadCastTransaction*', () => {
      const indexingHash = 'indexingHash';
      const existingTxIsBroadcasting: any = {
        isBroadcasting: true
      };
      const existingTxBroadcastSuccessful: any = {
        broadcastSuccessful: true
      };
      const existingTxFalse: any = false;

      const gens: any = {};
      gens.gen = cloneableGenerator(shouldBroadcastTransaction)(indexingHash);

      it('should select getTransactionStats with indexingHash', () => {
        expect(gens.gen.next().value).toEqual(select(getTransactionStatus, indexingHash));
      });

      it('should return false when isBroadcasting', () => {
        gens.clone1 = gens.gen.clone();
        expect(gens.clone1.next(existingTxIsBroadcasting).value).toEqual(false);
      });

      it('should return false when broadcastSuccessful', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.clone2.next(existingTxBroadcastSuccessful).value).toEqual(false);
      });

      it('should return true when there is no existingTx', () => {
        gens.gen = gens.gen.clone();
        expect(gens.gen.next(existingTxFalse).value).toEqual(true);
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });

    describe('getSerializedTxAndIndexingHash*', () => {
      const web3Req: any = {
        type: 'BROADCAST_WEB3_TRANSACTION_REQUESTED'
      };
      const notWeb3Req: any = {
        type: 'NOT_WEB3_TRANSACTION_REQUEST'
      };
      const serializedTransaction: any = true;
      const indexingHash = 'indexingHash';

      const gens: any = {};
      gens.gen1 = cloneableGenerator(getSerializedTxAndIndexingHash)(web3Req);
      const gen2 = getSerializedTxAndIndexingHash(notWeb3Req);

      it('should select getWeb3Tx', () => {
        expect(gens.gen1.next().value).toEqual(select(getWeb3Tx));
      });

      it('should select getSignedTx', () => {
        expect(gen2.next().value).toEqual(select(getSignedTx));
      });

      it('should throw error if !serializedTransaction', () => {
        gens.clone1 = gens.gen1.clone();
        expect(() => gens.clone1.next(!serializedTransaction)).toThrowError(
          'Can not broadcast: tx does not exist'
        );
      });

      it('should call computeIndexingHash', () => {
        expect(gens.gen1.next(serializedTransaction).value).toEqual(
          call(computeIndexingHash, serializedTransaction)
        );
      });

      it('should return correctly', () => {
        expect(gens.gen1.next(indexingHash).value).toEqual({
          serializedTransaction,
          indexingHash
        });
      });

      it('should be done', () => {
        expect(gens.gen1.next().done).toEqual(true);
      });
    });
  });
  describe('Signing', () => {
    describe('signTransactionWrapper*', () => {
      const partialTx: any = {
        payload: 'payload'
      };
      const IWalletAndTx: any = {
        wallet: 'wallet'
      };
      const err = new Error('Error');

      const func = jest.fn();
      const gens: any = {};
      gens.gen = cloneableGenerator(signTransactionWrapper(func))(partialTx);

      it('should call getWalletAndTransAction', () => {
        expect(gens.gen.next().value).toEqual(call(getWalletAndTransaction, partialTx.payload));
      });

      it('should call getFrom', () => {
        gens.clone = gens.gen.clone();
        expect(gens.gen.next(IWalletAndTx).value).toEqual(call(getFromSaga));
      });

      it('should call func with IWalletAndTx', () => {
        expect(gens.gen.next().value).toEqual(call(func, IWalletAndTx));
      });

      it('should handle errors', () => {
        expect(gens.clone.throw(err).value).toEqual(call(handleFailedTransaction, err));
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });

    describe('getWalletAndTransaction*', () => {
      const partialTx: any = {
        gasPrice: 'gasPrice',
        _chainId: '_chainId'
      };
      const wallet = {
        data2: 'data2'
      };
      const networkConfig = {
        chainId: 'chainId'
      };

      const gens: any = {};
      gens.gen = cloneableGenerator(getWalletAndTransaction)(partialTx);

      it('should select getWalletInst', () => {
        expect(gens.gen.next().value).toEqual(select(getWalletInst));
      });

      it('should error on no wallet', () => {
        gens.clone = gens.gen.clone();
        expect(() => gens.clone.next()).toThrow();
      });

      it('should select getNetworkConfig', () => {
        expect(gens.gen.next(wallet).value).toEqual(select(getNetworkConfig));
      });

      it('should return expected', () => {
        expect(gens.gen.next(networkConfig).value).toEqual({
          wallet,
          tx: partialTx
        });
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });

    describe('handleFailedTransaction*', () => {
      const err = new Error('Message');
      const gen = handleFailedTransaction(err);
      let random: () => number;

      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should put showNotification', () => {
        expect(gen.next().value).toEqual(put(showNotification('danger', err.message, 5000)));
      });

      it('should put signTransactionFailed', () => {
        expect(gen.next().value).toEqual(put(signTransactionFailed()));
      });
    });

    describe('getFrom*', () => {
      const getFromSucceeded = {
        type: TK.GET_FROM_SUCCEEDED
      };
      const getFromFailed = {
        type: TK.GET_FROM_FAILED
      };

      const gens: any = {};
      gens.gen = cloneableGenerator(getFromSaga)();

      it('should put getFromRequested', () => {
        expect(gens.gen.next().value).toEqual(put(getFromRequested()));
      });

      it('should take GET_FROM*', () => {
        expect(gens.gen.next().value).toEqual(take([TK.GET_FROM_SUCCEEDED, TK.GET_FROM_FAILED]));
      });

      it('should throw error if failed', () => {
        gens.clone = gens.gen.clone();
        expect(() => gens.clone.next(getFromFailed)).toThrow();
      });

      it('should return if success', () => {
        expect(gens.gen.next(getFromSucceeded).done).toEqual(true);
      });
    });
  });
  describe('Validation', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('rebaseUserInput*', () => {
      const validNumberValue = {
        raw: '1',
        value: Wei('1')
      };
      const notValidNumberValue: any = {
        raw: '-1',
        value: '-1'
      };
      const unit = 'unit';
      const newDecimal = 1;
      const prevDecimal = 1;

      const gens: any = {};
      gens.gen1 = rebaseUserInput(validNumberValue);
      gens.gen2 = rebaseUserInput(notValidNumberValue);

      describe('when a valid number', () => {
        it('should select getUnit', () => {
          expect(gens.gen1.next().value).toEqual(select(getUnit));
        });

        it('should select getDecimalFromUnit with unit', () => {
          expect(gens.gen1.next(unit).value).toEqual(select(getDecimalFromUnit, unit));
        });

        it('should return correctly', () => {
          expect(gens.gen1.next(newDecimal).value).toEqual({
            raw: validNumberValue.raw,
            value: toTokenBase(validNumberValue.raw, newDecimal)
          });
        });

        itShouldBeDone(gens.gen1);
      });

      describe('when not a valid number', () => {
        it('should select getUnit', () => {
          expect(gens.gen2.next().value).toEqual(select(getUnit));
        });

        it('should select getDecimalFromUnit with unit', () => {
          expect(gens.gen2.next(unit).value).toEqual(select(getDecimalFromUnit, unit));
        });

        it('should return correctly', () => {
          const result = JSON.stringify(gens.gen2.next(prevDecimal).value);
          const expected = JSON.stringify({
            raw: notValidNumberValue.raw,
            value: null
          });

          expect(result).toEqual(expected);
        });

        itShouldBeDone(gens.gen2);
      });
    });

    describe('validateInput*', () => {
      const input: any = 'input';
      const unit = 'unit';
      const etherBalance = Wei('1000');
      const etherTransaction = true;
      const validationTx = {
        gasLimit: Wei('30'),
        gasPrice: Wei('1'),
        value: Wei('10')
      };

      const gens: any = {};
      gens.gen = cloneableGenerator(validateInput)(input, unit);

      it('should return when !input', () => {
        expect(validateInput(null, '').next().done).toEqual(true);
      });

      it('should select getEtherBalance', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.gen.next().value).toEqual(select(getEtherBalance));
      });

      it('should select getOffline', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.gen.next(etherBalance).value).toEqual(select(getOffline));
        gens.clone1 = gens.gen.clone();
      });

      it('should call isNetworkUnit', () => {
        expect(gens.gen.next(false).value).toEqual(select(isNetworkUnit, unit));
        gens.clone3 = gens.gen.clone();
      });

      it('should return true when offline', () => {
        expect(gens.clone1.next(true).value).toEqual(select(isNetworkUnit, unit));
        expect(gens.clone1.next().done).toEqual(true);
      });

      it('should return when !etherBalance', () => {
        expect(gens.clone2.next(null).value).toEqual(select(getOffline));
        expect(gens.clone2.next(true).value).toEqual(select(isNetworkUnit, unit));
        expect(gens.clone2.next().done).toEqual(true);
      });

      it('should call makeCostCalculationTx', () => {
        expect(gens.gen.next(etherTransaction).value).toEqual(call(makeCostCalculationTx, input));
      });

      it('should return true if etherTransaction', () => {
        expect(gens.gen.next(validationTx).value).toEqual(true);
      });

      it('should select getTokenBalance if !etherTransaction', () => {
        gens.clone3.next(!etherTransaction);
        expect(gens.clone3.next(validationTx).value).toEqual(select(getTokenBalance, unit));
      });

      it('should return true if !etherTransaction', () => {
        expect(gens.clone3.next().value).toEqual(true);
      });
    });

    describe('makeCostCalculationTx*', () => {
      const value = Wei('100');
      const gasLimit = {
        value: Wei('10')
      };
      const gasPrice = {
        value: Wei('1')
      };
      const txObj = {
        gasLimit: gasLimit.value,
        gasPrice: gasPrice.value,
        value
      };

      const gen = makeCostCalculationTx(value);

      it('should select getGasLimit', () => {
        expect(gen.next().value).toEqual(select(getGasLimit));
      });

      it('should select getGasPrice', () => {
        expect(gen.next(gasLimit).value).toEqual(select(getGasPrice));
      });

      it('should call makeTransaction', () => {
        expect(gen.next(gasPrice).value).toEqual(call(makeTransaction, txObj));
      });

      itShouldBeDone(gen);
    });
  });
});
