import { isEtherTransaction, getUnit, getDecimal } from 'selectors/transaction';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { SetCurrentValueAction, TypeKeys } from 'actions/transaction';
import { toTokenBase } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';

import { setCurrentValue } from 'sagas/transaction/current/currentValue';
import { cloneableGenerator } from 'redux-saga/utils';

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('setCurrentValue*', () => {
  const sharedLogic = (gens, etherTransaction) => {
    it('should select isEtherTransaction', () => {
      expect(gens.gen.next().value).toEqual(select(isEtherTransaction));
    });

    it('should select getUnit', () => {
      expect(gens.gen.next(etherTransaction).value).toEqual(select(getUnit));
    });
  };

  describe('when invalid number', () => {
    const action: any = {
      payload: 'invalidNumber'
    };
    const etherTransaction = true;

    const gens: any = {};
    gens.gen = cloneableGenerator(setCurrentValue)(action);

    sharedLogic(gens, etherTransaction);

    it('should put setter', () => {
      expect(gens.gen.next().value).toEqual(
        put(setValueField({ raw: action.payload, value: null }))
      );
    });

    itShouldBeDone(gens.gen);
  });

  describe('when valid number', () => {
    const payload = '100.00';
    const action: any = { payload };
    const etherTransaction = true;
    const unit = 'FAKE_COIN';
    const decimal = 10.0;
    const value = toTokenBase(payload, decimal);
    const isValid = true;

    const gens: any = {};
    gens.gen = cloneableGenerator(setCurrentValue)(action);

    sharedLogic(gens, etherTransaction);

    it('should select getDecimal', () => {
      expect(gens.gen.next(unit).value).toEqual(select(getDecimal));
    });

    it('should call validateInput', () => {
      expect(gens.gen.next(decimal).value).toEqual(call(validateInput, value, unit));
    });

    it('should put setter', () => {
      expect(gens.gen.next(isValid).value).toEqual(
        put(
          setValueField({
            raw: payload,
            value
          })
        )
      );
    });

    itShouldBeDone(gens.gen);
  });
});
