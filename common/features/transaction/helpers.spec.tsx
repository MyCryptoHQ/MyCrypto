import { SagaIterator } from 'redux-saga';
import { select, call, put, take } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { makeTransaction } from 'libs/transaction';
import { toTokenBase, Wei } from 'libs/units';
import configuredStore from 'features/store';
import * as derivedSelectors from 'features/selectors';
import { getOffline } from 'features/config/meta/selectors';
import { getNetworkConfig, isNetworkUnit } from 'features/config/selectors';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsSelectors } from './fields';
import { transactionNetworkTypes, transactionNetworkActions } from './network';
import { transactionSignActions, transactionSignSagas } from './sign';
import * as helpers from './helpers';

configuredStore.getState();

describe('transaction: Helpers', () => {
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
      gens.gen = cloneableGenerator(transactionSignSagas.signTransactionWrapper(func))(partialTx);

      it('should call getWalletAndTransAction', () => {
        expect(gens.gen.next().value).toEqual(
          call(transactionSignSagas.getWalletAndTransaction, partialTx.payload)
        );
      });

      it('should call getFrom', () => {
        gens.clone = gens.gen.clone();
        expect(gens.gen.next(IWalletAndTx).value).toEqual(call(transactionSignSagas.getFromSaga));
      });

      it('should call func with IWalletAndTx', () => {
        expect(gens.gen.next().value).toEqual(call(func, IWalletAndTx));
      });

      it('should handle errors', () => {
        expect(gens.clone.throw(err).value).toEqual(
          call(transactionSignSagas.handleFailedTransaction, err)
        );
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
      gens.gen = cloneableGenerator(transactionSignSagas.getWalletAndTransaction)(partialTx);

      it('should select getWalletInst', () => {
        expect(gens.gen.next().value).toEqual(select(walletSelectors.getWalletInst));
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
      const gen = transactionSignSagas.handleFailedTransaction(err);
      let random: () => number;

      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should put showNotification', () => {
        expect(gen.next().value).toEqual(
          put(notificationsActions.showNotification('danger', err.message, 5000))
        );
      });

      it('should put signTransactionFailed', () => {
        expect(gen.next().value).toEqual(put(transactionSignActions.signTransactionFailed()));
      });
    });

    describe('getFrom*', () => {
      const getFromSucceeded = {
        type: transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED
      };
      const getFromFailed = {
        type: transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED
      };

      const gens: any = {};
      gens.gen = cloneableGenerator(transactionSignSagas.getFromSaga)();

      it('should put getFromRequested', () => {
        expect(gens.gen.next().value).toEqual(put(transactionNetworkActions.getFromRequested()));
      });

      it('should take GET_FROM*', () => {
        expect(gens.gen.next().value).toEqual(
          take([
            transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED,
            transactionNetworkTypes.TransactionNetworkActions.GET_FROM_FAILED
          ])
        );
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
      gens.gen1 = helpers.rebaseUserInput(validNumberValue);
      gens.gen2 = helpers.rebaseUserInput(notValidNumberValue);

      describe('when a valid number', () => {
        it('should select getUnit', () => {
          expect(gens.gen1.next().value).toEqual(select(derivedSelectors.getUnit));
        });

        it('should select getDecimalFromUnit with unit', () => {
          expect(gens.gen1.next(unit).value).toEqual(
            select(derivedSelectors.getDecimalFromUnit, unit)
          );
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
          expect(gens.gen2.next().value).toEqual(select(derivedSelectors.getUnit));
        });

        it('should select getDecimalFromUnit with unit', () => {
          expect(gens.gen2.next(unit).value).toEqual(
            select(derivedSelectors.getDecimalFromUnit, unit)
          );
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
      gens.gen = cloneableGenerator(helpers.validateInput)(input, unit);

      it('should return when !input', () => {
        expect(helpers.validateInput(null, '').next().done).toEqual(true);
      });

      it('should select getEtherBalance', () => {
        gens.clone2 = gens.gen.clone();
        expect(gens.gen.next().value).toEqual(select(walletSelectors.getEtherBalance));
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
        expect(gens.gen.next(etherTransaction).value).toEqual(
          call(helpers.makeCostCalculationTx, input)
        );
      });

      it('should return true if etherTransaction', () => {
        expect(gens.gen.next(validationTx).value).toEqual(true);
      });

      it('should select getTokenBalance if !etherTransaction', () => {
        gens.clone3.next(!etherTransaction);
        expect(gens.clone3.next(validationTx).value).toEqual(
          select(derivedSelectors.getTokenBalance, unit)
        );
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

      const gen = helpers.makeCostCalculationTx(value);

      it('should select getGasLimit', () => {
        expect(gen.next().value).toEqual(select(transactionFieldsSelectors.getGasLimit));
      });

      it('should select getGasPrice', () => {
        expect(gen.next(gasLimit).value).toEqual(select(transactionFieldsSelectors.getGasPrice));
      });

      it('should call makeTransaction', () => {
        expect(gen.next(gasPrice).value).toEqual(call(makeTransaction, txObj));
      });

      itShouldBeDone(gen);
    });
  });
});
