import BN from 'bn.js';
import { SagaIterator, delay } from 'redux-saga';
import { cloneableGenerator } from 'redux-saga/utils';
import { call, put } from 'redux-saga/effects';

import { Data, Wei, Nonce, gasPriceToBase } from 'libs/units';
import { isValidHex, isValidNonce, gasPriceValidator, gasLimitValidator } from 'libs/validators';
import * as actions from './actions';
import * as sagas from './sagas';

describe('Fields Saga', () => {
  const itShouldBeDone = (gen: SagaIterator) => {
    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  };

  describe('handleDataInput*', () => {
    const payload = 'payload';
    const action: any = { payload };
    const validData = true;

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.handleDataInput)(action);

    it('should put call isValidHex with payload', () => {
      expect(gens.gen.next().value).toEqual(call(isValidHex, payload));
    });

    it('should put setDataField with null value when data is invalid', () => {
      gens.clone = gens.gen.clone();
      expect(gens.clone.next(!validData).value).toEqual(
        put(
          actions.setDataField({
            raw: payload,
            value: null
          })
        )
      );
    });

    it('should put setDataField with parsed value', () => {
      expect(gens.gen.next(validData).value).toEqual(
        put(
          actions.setDataField({
            raw: payload,
            value: Data(payload)
          })
        )
      );
    });

    itShouldBeDone(gens.gen);
  });

  describe('handleGasLimitInput*', () => {
    const payload = '100.111';
    const action: any = { payload };

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.handleGasLimitInput)(action);

    it('should call gasLimitValidator', () => {
      expect(gens.gen.next().value).toEqual(call(gasLimitValidator, payload));
    });

    it('should put setGasLimitField with null value when payload is invalid', () => {
      gens.gen.invalid = gens.gen.clone();
      expect(gens.gen.invalid.next(false).value).toEqual(
        put(
          actions.setGasLimitField({
            raw: payload,
            value: null
          })
        )
      );
    });

    it('should put setGasLimitField with Wei value', () => {
      gens.gen.valid = gens.gen.clone();
      expect(gens.gen.valid.next(true).value).toEqual(
        put(
          actions.setGasLimitField({
            raw: payload,
            value: Wei(payload)
          })
        )
      );
    });

    it('should be done', () => {
      expect(gens.gen.invalid.next().done).toEqual(true);
      expect(gens.gen.valid.next().done).toEqual(true);
    });
  });

  describe('handleGasPriceInput*', () => {
    const payload = '100.111';
    const action: any = { payload };
    const priceFloat = parseFloat(payload);

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.handleGasPriceInput)(action);

    it('should call gasPriceValidator', () => {
      expect(gens.gen.next().value).toEqual(call(gasPriceValidator, priceFloat));
    });

    it('should put setGasPriceField with 0 value when payload is invalid', () => {
      gens.gen.invalid = gens.gen.clone();
      expect(gens.gen.invalid.next(false).value).toEqual(
        put(
          actions.setGasPriceField({
            raw: payload,
            value: new BN(0)
          })
        )
      );
    });

    it('should put setGasPriceField with base gas price value', () => {
      gens.gen.valid = gens.gen.clone();
      expect(gens.gen.valid.next(true).value).toEqual(
        put(
          actions.setGasPriceField({
            raw: payload,
            value: gasPriceToBase(priceFloat)
          })
        )
      );
    });

    it('should be done', () => {
      expect(gens.gen.invalid.next().done).toEqual(true);
      expect(gens.gen.valid.next().done).toEqual(true);
    });
  });

  describe('handleGasPriceInputIntent*', () => {
    const payload = '100.111';
    const action: any = { payload };
    const gen = sagas.handleGasPriceInputIntent(action);
    it('should call delay', () => {
      expect(gen.next().value).toEqual(call(delay, 300));
    });

    it('should put inputGasPrice', () => {
      expect(gen.next().value).toEqual(put(actions.inputGasPrice(payload)));
    });
  });

  describe('handleNonceInput*', () => {
    const payload = '42';
    const action: any = { payload };
    const validNonce = true;

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.handleNonceInput)(action);

    it('should put call isValidNonce with payload', () => {
      expect(gens.gen.next().value).toEqual(call(isValidNonce, payload));
    });

    it('should put setDataField with null value when data is invalid', () => {
      gens.clone = gens.gen.clone();
      expect(gens.clone.next(!validNonce).value).toEqual(
        put(
          actions.setNonceField({
            raw: payload,
            value: null
          })
        )
      );
    });

    it('should put setDataField with parsed value', () => {
      expect(gens.gen.next(validNonce).value).toEqual(
        put(
          actions.setNonceField({
            raw: payload,
            value: Nonce(payload)
          })
        )
      );
    });

    itShouldBeDone(gens.gen);
  });
});
