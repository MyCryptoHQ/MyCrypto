import { apply, put, select } from 'redux-saga/effects';
import {
  sendEverythingFailed,
  setValueField,
  setTokenValue,
  sendEverythingSucceeded
} from 'actions/transaction';
import { showNotification } from 'actions/notifications';
import { isEtherTransaction, getTransaction, getDecimal } from 'selectors/transaction';
import { getEtherBalance, getCurrentBalance } from 'selectors/wallet';
import { fromTokenBase, fromWei, Wei } from 'libs/units';
import { handleSendEverything } from 'sagas/transaction/sendEverything';
import { cloneableGenerator } from 'redux-saga/utils';

describe('handleSendEverything*', () => {
  let random;
  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  const sharedStart = (gen, transactionObj, currentBalance) => {
    it('should select getTransaction', () => {
      expect(gen.next().value).toEqual(select(getTransaction));
    });

    it('should select getCurrentBalance', () => {
      expect(gen.next(transactionObj).value).toEqual(select(getCurrentBalance));
    });

    it('should select getEtherBalance', () => {
      expect(gen.next(currentBalance).value).toEqual(select(getEtherBalance));
    });
  };

  describe('!etherBalance', () => {
    const transactionObj = {
      transaction: 'transaction'
    };
    const currentBalance = Wei('100');
    const etherBalance = null;
    const gen = handleSendEverything();

    sharedStart(gen, transactionObj, currentBalance);

    it('should put sendEverythingFailed', () => {
      expect(gen.next(etherBalance).value).toEqual(put(sendEverythingFailed()));
    });
  });

  describe('!currentBalance', () => {
    const transactionObj = {
      transaction: 'transaction'
    };
    const currentBalance = null;
    const etherBalance = Wei('100');
    const gen = handleSendEverything();

    sharedStart(gen, transactionObj, currentBalance);

    it('should put sendEverythingFailed', () => {
      expect(gen.next(etherBalance).value).toEqual(put(sendEverythingFailed()));
    });
  });

  describe('etherBalance && currentBalance', () => {
    const transaction = {
      getUpfrontCost: jest.fn()
    };
    const transactionObj = { transaction };
    const currentBalance = Wei('100');
    const etherBalance = Wei('100');
    const etherTransaction = true;

    const gens: any = {};
    gens.gen = cloneableGenerator(handleSendEverything)();
    gens.clone1 = {};
    gens.clone2 = {};

    sharedStart(gens.gen, transactionObj, currentBalance);

    it('should select isEtherTransaction', () => {
      expect(gens.gen.next(etherBalance).value).toEqual(select(isEtherTransaction));
    });

    it('should apply transaction.getUpfrontCost', () => {
      gens.clone2 = gens.gen.clone();
      expect(gens.gen.next(etherTransaction).value).toEqual(
        apply(transaction, transaction.getUpfrontCost)
      );
      gens.clone1 = gens.gen.clone();
    });

    describe('if totalCost > etherBalance', () => {
      const totalCost = Wei('1000');

      it('should put showNotification', () => {
        expect(gens.clone1.next(totalCost).value).toEqual(
          put(
            showNotification(
              'warning',
              `The cost of gas is higher than your balance:
    Total cost: ${totalCost} > 
    Your Ether balance: ${etherBalance}`
            )
          )
        );
      });

      it('should put sendEverythingFailed', () => {
        expect(gens.clone1.next().value).toEqual(put(sendEverythingFailed()));
      });

      it('should put setValueField', () => {
        expect(gens.clone1.next().value).toEqual(put(setValueField({ raw: '0', value: null })));
      });

      it('should be done', () => {
        expect(gens.clone1.next().done).toEqual(true);
      });
    });

    describe('if etherTransaction', () => {
      const totalCost = Wei('10');
      const remainder = currentBalance.sub(totalCost);
      const rawVersion = fromWei(remainder, 'ether');

      it('should put setValueField', () => {
        expect(gens.gen.next(totalCost).value).toEqual(
          put(
            setValueField({
              raw: rawVersion,
              value: remainder
            })
          )
        );
      });

      it('should put sendEverythingSucceeded', () => {
        expect(gens.gen.next().value).toEqual(put(sendEverythingSucceeded()));
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });

    describe('if !etherTransaction (a token tx)', () => {
      const totalCostLocal = Wei('1');
      const etherTransactionLocal = false;
      const decimal = 3;
      const rawVersion = fromTokenBase(currentBalance, decimal);

      it('should apply transaction.getUpfrontCost', () => {
        expect(gens.clone2.next(etherTransactionLocal).value).toEqual(
          apply(transaction, transaction.getUpfrontCost)
        );
      });

      it('should select getDecimal', () => {
        expect(gens.clone2.next(totalCostLocal).value).toEqual(select(getDecimal));
      });

      it('should put setTokenValue', () => {
        expect(gens.clone2.next(decimal).value).toEqual(
          put(setTokenValue({ raw: rawVersion, value: currentBalance }))
        );
      });

      it('should put sendEverythingSucceeded', () => {
        expect(gens.clone2.next().value).toEqual(put(sendEverythingSucceeded()));
      });

      it('should be done', () => {
        expect(gens.clone2.next().done).toEqual(true);
      });
    });
  });
});
